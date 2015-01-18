package controllers

import akka.actor._
import akka.actor.ActorRef
import org.joda.time.{Interval, Minutes, Hours, DateTime}
import play.api.libs.json._
import play.api.mvc.WebSocket.FrameFormatter
import play.api.mvc.{Action, WebSocket, Result, Controller}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._
import controllers.CountDown._
import controllers.TMinus._
import play.api.Play.current
import play.api.libs.functional.syntax._

object TMinusController extends Controller {

  def index() = Action { r =>
    Ok(views.html.index.render)
  }


  def startCountDown =
    WebSocket.acceptWithActor[CountDown, TMinus] { r => out =>
      CountDownFeedActor.props(out)
    }

  def echo() = Action { r =>
    val body = r.body.asJson
    Ok(body.get)
  }



}


case class CountDown(label: String, end: Long)
object CountDown {
  implicit val cdFormat = Json.format[CountDown]
  implicit val cdWSFormat = FrameFormatter.jsonFrame[CountDown]

}

trait TMinusState
case object Active extends TMinusState
case object Expired extends TMinusState

case class TMinus(state: TMinusState, remaining: Long)
object TMinus {

  implicit val tWrites = new Writes[TMinus] {
    def writes(tm: TMinus): JsValue = {
      Json.obj(
        "state" -> tm.state.toString,
        "remainder" -> tm.remaining
      )
    }
  }

  implicit val tReads: Reads[TMinus] = (
    (JsPath \ "state").read[String].map(x => x match{
      case "Active" => Active
      case "Expired" => Expired
    }) and
      (JsPath \ "remainder").read[Long]
    )(TMinus.apply _)

  implicit val tMinusFormat = Format(tReads, tWrites)
  implicit val tMinusWSFormat = FrameFormatter.jsonFrame[TMinus]
}

object CountDownFeedActor {
  def props(out: ActorRef) = {
    Props(new CountDownFeedActor(out))
  }
}

class CountDownFeedActor(out: ActorRef) extends Actor {

  var endTs: DateTime = new DateTime()
  var countDown: Cancellable = null


  def receive = {

    case CountDown(_, end) => {
      endTs = new DateTime(end)
      countDown = context.system.scheduler.schedule(Duration.Zero, 60000.millis, self, new DateTime())
    }

    case tick: DateTime => {
      if (endTs.isBefore(tick)) {
        TMinus(Expired, 0)
      }
      else {
        TMinus(Active, calcDiff(tick, endTs))
      }
    }
  }

  private def calcDiff(s: DateTime, e: DateTime) =
    new Interval(s, e).toDurationMillis

}
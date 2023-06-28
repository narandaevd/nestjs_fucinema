import {ActorInfo} from "../../store/reducers/film-page";

export function Actor(actor: ActorInfo): React.ReactElement {
  return (
    <div>
      {`${actor.firstName} ${actor.lastName}`}
    </div>
  )
}
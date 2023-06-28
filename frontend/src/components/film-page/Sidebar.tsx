import {ActorInfo} from "../../store/reducers/film-page";
import {Actor} from "./Actor";

export function Sidebar({actors}: {actors: ActorInfo[]}): React.ReactElement {
  return (
    <div className="full__film__info__sidebar">
      <div className="full__film__info__actors">
          <span style={{
            fontWeight: 500,
            fontSize: '24px'
          }}>Актеры:</span>
          {(actors?.length) ? 
            actors.map((a) => <Actor {...a}/>)
            :
            <Actor {...{
              firstName: 'Актёров',
              lastName: 'нет'
            } as ActorInfo}/>
          }
      </div>
  </div>
  );
}

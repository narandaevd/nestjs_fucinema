import {ReportInfo} from "../../store/reducers/film-page";
import {colorPicker} from "../common/color-picker";

interface IReportOwnProps {
  normValue: number;
}

export function Report({
  content,
  user,
  rate,
  actorPlayRate,
  plotRate,
  normValue,
}: ReportInfo & IReportOwnProps): React.ReactElement {
  return (
    <div className="full__film__info__reportlist__item">
      <div className="info">
        <div className="title">
            {user.login}
        </div>
        <div className="content">
          {content}
        </div>
        <div style={{marginTop: '10px'}}>
          Оценка игры актёров - {actorPlayRate ? actorPlayRate : 'Не оценено'}
        </div>
        <div style={{marginTop: '10px'}}>
          Оценка сюжета - {plotRate ? plotRate : 'Не оценено'}
        </div>
      </div>
      <div 
        className="rating"
        style={{
          backgroundColor: colorPicker(rate, normValue),
        }}
      >
        <span>{rate / normValue}/{normValue}</span>
      </div>
    </div>
  );
}

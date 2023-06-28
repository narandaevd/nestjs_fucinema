import {ReportInfo} from "../../store/reducers/film-page"
import {Report} from "./Report"

export function ReportList({reports}: {
  reports: ReportInfo[],
  normValue: number,
}): React.ReactElement {
  const normValue = 10;
  return (
    <div className="full__film__info__reportlist">
      <div style={{
        marginBottom: '15px',
        fontSize: '20px',
        fontWeight: 500,
      }}>
        Отзывы
      </div>
      {
        (reports?.length) ? reports.map(r => {
          return <Report {...r} normValue={normValue}/>
        }) : 'Нет отзывов'
      }
    </div>
  );
}

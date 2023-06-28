import {useParams} from "react-router-dom"
import FilmDescription from './FilmDescription';
import { AboutFilm } from './AboutFilm';
import { FilmImage } from './FilmImage';
import { Sidebar } from './Sidebar';
import { ReportList } from './ReportList';
import ReportForm from './ReportForm';
import {connect} from "react-redux";
import {useEffect} from "react";
import {loadFilmAction} from "../../store/actions/film-page";
import {IDispatch, IRootState} from "../../store";
import {FullFilmInfo} from "../../store/reducers/film-page";
import {IDispatchProps} from "../common";

interface FilmMainPageStateProps {
  film: FullFilmInfo;
}
const mapStateToProps = (state: IRootState): FilmMainPageStateProps => ({
  film: state.film.filmInfo,
});
const mapDispatchToProps = (dispatch: IDispatch): IDispatchProps => ({
  presenter: dispatch,
});
type FilmMainPageProps = FilmMainPageStateProps & IDispatchProps;

function FilmMainPage({film, presenter}: FilmMainPageProps): React.ReactElement {

  const {uuid} = useParams<string>();
  const normValue = 10;

  useEffect(() => {
    presenter(loadFilmAction(uuid));
  }, []);


  return (
    <div className="full__film__info">
      <div className="wrap1">
          <div className="wrap2">
              <FilmImage />
              <AboutFilm 
                title={film?.title} 
                companyName={
                  (film?.company?.title) ? film.company.title : '-'
                } 
                companyCountry={
                  (film?.company?.country) ? film.company.country : '-'
                }                
              />
          </div>
          <FilmDescription
            content={(film?.description) ? film.description : 'Нет описания'}
          />
          <ReportList 
            normValue={normValue} 
            reports={film?.reports}
          />
          <ReportForm 
            normValue={normValue}
          />
      </div>
      <Sidebar actors={film?.actors}/>
  </div>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilmMainPage);
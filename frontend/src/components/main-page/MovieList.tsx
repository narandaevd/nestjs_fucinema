import {Pagination} from "@mui/material"
import {Film, FilmData} from "./Film"
import {connect} from "react-redux";
import {useEffect} from "react";
import {filterFilmsAction} from "../../store/actions";
import {IRootState} from "../../store";

const mapStateToProps = (state: IRootState) => ({
  films: state.films.films,
  totalCount: state.films.totalCount,
});

const mapDispatchToProps = (dispatch: Function) => ({
  presenter: dispatch,
});

function MovieList({films, presenter, totalCount}: {
  films: FilmData[],
  totalCount: number,
  presenter: Function,
}): React.ReactElement {

  const PAGE_SIZE = 3;
  useEffect(() => {
    console.log(filterFilmsAction(0, PAGE_SIZE));
    presenter(filterFilmsAction(0, PAGE_SIZE));
  }, []);

  return (
    <div className="list">
      <span style={{
        marginBottom: '30px',
        fontSize: '20px',
        fontWeight: 500
      }}
      >Список фильмов</span>
      {
        (films?.length) ? 
          films.map((d: FilmData) => <Film {...d} />)
          :
          null
      }
      {
        (films?.length) ? 
          <Pagination
            onChange={(_, p) => {
              presenter(filterFilmsAction((p - 1) * PAGE_SIZE, PAGE_SIZE));
            }}
            className="full__film__info__pagination"
            count={
              Math.floor(totalCount / PAGE_SIZE) + (Math.floor(totalCount % PAGE_SIZE) === 0 ? 0 : 1)
            }
            color="secondary"
          />
          :
          <div className="list__item__empty">
            <div style={{margin: '0 auto'}}>                    
                Список фильмов пуст.
            </div>
          </div>
      }
    </div>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MovieList);

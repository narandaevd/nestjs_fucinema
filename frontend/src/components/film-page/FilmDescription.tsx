import {Alert, Button, Modal, TextField, Typography} from "@mui/material";
import {connect} from "react-redux";
import {changeDescriptionAction, closeDescriptionModalAction, openDescriptionModalAction} from "../../store/actions/film-page";
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import {IDispatch, IRootState} from "../../store";
import {IDispatchProps} from "../common";
import {useEffect} from "react";

interface IFilmDescriptionStateProps {
  isModalOpen: boolean,
  changeDescriptionMessage: string,
  changeDescriptionResult: boolean,
}
interface IFilmDescriptionOwnProps {
  content: string;
}
const mapStateToProps = (state: IRootState, ownProps: IFilmDescriptionOwnProps): 
  IFilmDescriptionStateProps & IFilmDescriptionOwnProps => ({
  isModalOpen: state.film.isModalOpen,
  changeDescriptionMessage: state.film.changeDescriptionMessage,
  changeDescriptionResult: state.film.changeDescriptionResult,
  ...ownProps,
});
const mapDispatchToProps = (dispatch: IDispatch): IDispatchProps => ({
  presenter: dispatch,
});
type FilmDescriptionProps = IFilmDescriptionOwnProps & IFilmDescriptionStateProps & IDispatchProps;

interface FormInfo {
  description: string;
  login: string;
  password: string;
}

function FilmDescription({
  content, 
  isModalOpen, 
  presenter,
  changeDescriptionMessage,
  changeDescriptionResult
}: FilmDescriptionProps): React.ReactElement {

  const {uuid} = useParams<string>();
  const {register, handleSubmit} = useForm<FormInfo>();
  const TIMEOUT = 3;
  const onSubmit = (data: FormInfo) => {
    presenter(changeDescriptionAction(
      data.description,
      data.login, 
      data.password,
      uuid, 
    ));
  }

  useEffect(() => {
    if (changeDescriptionResult === true)
      setTimeout(() => window.location.reload(), TIMEOUT * 1000);
  }, [changeDescriptionResult])

  return (
    <div className="full__film__info__descr">
      <span style={{
        fontWeight: 400, 
        fontSize: '24px',
      }}>Описание фильма:</span>
      <div style={{
        margin: '10px 0 10px 0',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        textOverflow: 'ellipsis',
      }}>
        {content}
      </div>
      <Button
        variant='outlined'
        color='secondary'
        onClick={() => presenter(openDescriptionModalAction())}
      >
        Изменить описание фильма
      </Button>
      <Modal
        open={isModalOpen}
        onClose={() => presenter(closeDescriptionModalAction())}
      >
        <form
          onSubmit={handleSubmit(onSubmit)} 
          style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '24',
          padding: 20,
        }}>
          <Typography variant="h6" component="h2">
            Заполните форму
          </Typography>
          <TextField
            {...register('login')}
            style={{
              marginTop: '15px',
            }}
            size="small"
            variant="standard" 
            label="Введите логин"
          />
          <TextField 
            {...register('password')}
            style={{
              marginTop: '15px',
            }}
            size="small"
            variant="standard" 
            label="Введите пароль"
          />
          <TextField 
            {...register('description')}
            style={{
              marginTop: '15px',
              width: '300px'
            }}
            required
            variant="standard" 
            label="Введите описание"
            multiline
          />
          <Button
            type="submit"
            sx={{marginTop: 3, marginBottom: 1}}
            variant="outlined"
            color='secondary'
          >Изменить</Button>
          {
            (() => {
              switch (changeDescriptionResult) {
                case true:
                  return (<>
                    <Alert severity="success">{changeDescriptionMessage}</Alert>
                    <Alert sx={{marginTop: 2}} severity="info">Через {TIMEOUT} секунды перезагрузится страница</Alert>
                  </>);
                case false:
                  return <Alert severity="error">{changeDescriptionMessage}</Alert>;
                default:
                  return null;
              }
            })()
          }
        </form>
      </Modal>
  </div>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilmDescription);

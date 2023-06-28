import {Alert, Button, Rating, Stack, TextField, Typography} from "@mui/material";
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import {putReportAction} from "../../store/actions/film-page";
import {connect} from "react-redux";
import {IRateOptionCheckResult, RateOptionCheckCode, getRateAction} from "../../store/actions/film-page/get-rate.action";
import {useEffect} from "react";
import {IDispatch, IRootState} from "../../store";
import {IDispatchProps} from "../common";
import {colorPicker} from "../common/color-picker";

interface IReportFormStateProps {
  putReportMessage: string;
  putReportResult: boolean;
  rating: number;
  maxRating: number;
  results: IRateOptionCheckResult[];
}

interface IReportFormOwnProps {
  normValue: number
}

const mapStateToProps = (state: IRootState, {normValue}: IReportFormOwnProps): IReportFormStateProps & IReportFormOwnProps => ({
  putReportMessage: state.film.putReportMessage,
  putReportResult: state.film.putReportResult,
  maxRating: state.film.maxRating,
  rating: state.film.rating,
  results: state.film.results,
  normValue,
});
const mapDispatchToProps = (dispatch: IDispatch): IDispatchProps => ({
  presenter: dispatch,
});
type IReportFormProps = IReportFormStateProps & IReportFormOwnProps & IDispatchProps;

let content: string = '';
let actorPlayRate: number;
let plotRate: number;

interface FormData {
  content: string;
  login: string;
  password: string;
}

function ReportForm({
  putReportMessage,
  putReportResult,
  rating,
  results,
  normValue,
  presenter
}: IReportFormProps): React.ReactElement {

  const {uuid} = useParams<string>();
  const {register, handleSubmit} = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    presenter(putReportAction(
      data.content,
      data.login,
      data.password,
      uuid,
      actorPlayRate,
      plotRate
    ));
  }

  const TIMEOUT = 3;
  useEffect(() => {
    if (putReportResult === true)
      setTimeout(() => window.location.reload(), TIMEOUT * 1000);
  }, [putReportResult])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="full__film__info__reportform"
    >
      <span
        style={{
          fontSize: '20px',
          fontWeight: 500,
        }}
      >Оставьте отзыв к фильму</span>
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
          id="content"
          {...register('content')}
          style={{
            marginTop: '15px',
          }}
          variant="standard"
          size="small"
          label="Введите содержание"
          multiline
          onChange={e => {
            content = e.target.value;
            presenter(getRateAction(content, plotRate, actorPlayRate));
          }}
        />
      <Typography mt={'15px'}>Оцените игру актёров</Typography>
      <Rating 
        name="simple-controlled"
        onChange={(_, newValue) => {
          actorPlayRate = newValue;
          presenter(getRateAction(content, plotRate, actorPlayRate));
        }}
        id='actorPlay'
      />
      <Typography mt={'15px'}>Оцените сюжет</Typography>
      <Rating 
        name="simple-controlled"
        id='plot'
        onChange={(_, newValue) => {
          plotRate = newValue;
          presenter(getRateAction(content, plotRate, actorPlayRate));
        }}
      />
      <Button
        type="submit"
        style={{
          marginTop: '15px',
          marginBottom: '15px',
          marginLeft: '15px'
        }}
        variant='outlined'
        color="info"
      >
        Оставить
      </Button>
      {
        (() => {
          switch (putReportResult) {
            case true:
              return (<>
                <Alert severity="success">{putReportMessage}</Alert>
                <Alert sx={{marginTop: 2, marginBottom: 2}} severity="info">Через {TIMEOUT} секунды перезагрузится страница</Alert>
              </>);
            case false:
              return <Alert 
                severity="error"
                sx={{marginBottom: 2}}
              >{putReportMessage}</Alert>;
            default:
              return null;
          }
        })()
      }
      {
        content && rating != null ? (
          <>
            <Typography>Оценка отзыва:</Typography>
            <Typography
              fontSize={'30px'}
              color={colorPicker(rating, normValue)}
            >{rating / normValue}/{normValue}</Typography>
          </>
        ) : null
      }
      <Stack>
      {
        content && results
          ?.filter((r: IRateOptionCheckResult) => r.code === RateOptionCheckCode.FAILURE)
          ?.map((r: IRateOptionCheckResult) => <Alert 
            sx={{marginBottom: 2}}
            variant="outlined"
            severity="warning"
          >{r.failureMessage}</Alert>)
      }
      </Stack>
    </form>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportForm);

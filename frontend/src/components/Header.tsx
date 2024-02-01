import {Alert, Button, Modal, TextField, Typography} from "@mui/material";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {connect} from "react-redux";
import {registerAction, registerCloseAction, registerOpenAction} from "../store/actions";
import {IDispatch, IRootState} from "../store";
import {IDispatchProps} from "./common";
import { Link } from "react-router-dom";

interface IHeaderStateProps {
  msg: string,
  result: boolean,
  isModalOpen: boolean,
}
const mapStateToProps = (state: IRootState): IHeaderStateProps => ({
  msg: state.register.msg,
  result: state.register.registerResult,
  isModalOpen: state.register.isModalOpen,
});
const mapDispatchToProps = (dispatch: IDispatch): IDispatchProps => ({
  presenter: dispatch,
});
type HeaderProps = IHeaderStateProps & IDispatchProps;

interface FormInfo {
  login: string, 
  password: string
}

function Header({
  msg, 
  presenter, 
  isModalOpen,
  result,
}: HeaderProps): React.ReactElement {

  const onSubmit = (data: FormInfo) => presenter(registerAction(data.login, data.password));
  const {register, handleSubmit} = useForm<FormInfo>();

  const TIMEOUT = 3;
  useEffect(() => {
    if (result === true)
      setTimeout(() => window.location.reload(), TIMEOUT * 1000);
  }, [result])

  return (
    <div className="header">
      <div className="container">
        <div className="header__wrap">
            <div className="header__logo"><Link to="/">fucinema</Link></div>
            <Button
              onClick={() => presenter(registerOpenAction())}
              variant="contained"
              color='primary'
            >
              Регистрация
            </Button>
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onClose={() => presenter(registerCloseAction())}
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
            padding: 35,
          }}
        >
          <Typography variant="h6" component="h2">
            Заполните форму регистрации
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
          <Button
            type="submit"
            sx={{marginTop: 3}}
            variant="outlined"
            color='success'
          >Зарегистрироваться</Button>
          {
            (() => {
              switch (result) {
                case true:
                  return (<>
                    <Alert sx={{marginTop: 2}} severity="success">{msg}</Alert>
                    <Alert sx={{marginTop: 2}} severity="info">Через {TIMEOUT} секунды перезагрузится страница</Alert>
                  </>);
                case false:
                  return <Alert 
                    sx={{marginTop: 2}}
                    severity="error"
                  >{msg}</Alert>;
                default:
                  return null;
              }
            })()
          }
        </form>
      </Modal>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);

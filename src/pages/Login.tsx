import {IonContent,  IonProgressBar, IonPage, IonItem, IonLabel, IonInput, IonButton, useIonViewDidEnter } from '@ionic/react';
import React, { useState } from 'react';
import {  useHistory} from 'react-router';
import './Login.css';
import {login, fcm } from '../firebaseConfig';
import { presentToast } from '../toast';
import Logo from '../images/crlogolight.png';
import { Plugins } from "@capacitor/core";
const { PushNotifications} = Plugins;

const Login: React.FC = () => {

  const history = useHistory();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarLoading, setMostrarLoading] = useState(false);
  const [loginAnterior, ] = useState(JSON.parse(localStorage.getItem('user')!));
  
  const logar = async() => {
    setMostrarLoading(true);
    const user = await login(email, senha);
    if(user){
        localStorage.setItem('user', JSON.stringify(user));
        history.replace('/rooms', {user});
        
    } else {
        presentToast('Dados incorretos.')
    }
    setMostrarLoading(false);
  }

  PushNotifications.register().then(()=>{
    fcm.subscribeTo({ topic: "all" }).catch(()=>{});
  }).catch(()=>{});

  useIonViewDidEnter(()=>{
    if(loginAnterior){
      history.replace('/rooms', {user: loginAnterior});
    }
  });

  return (
    <IonPage>
      
      <IonContent color="dark">
        <div id="login-container">
            
            <img id="logo-login" width="200px" height="70px" src={Logo} alt=""/>
            <span id="descricao-login">Converse sobre o que quiser! </span>
            <span id="descricao-login">Crie uma sala e encontre pessoas com os mesmos interesses 💬</span>
            

            <div id="login-campos-container">
                <IonItem color="light" className="input-login">
                    <IonLabel position="floating">E-mail</IonLabel>
                    <IonInput type="email" onIonChange={(e:any) => setEmail(e.target.value)}></IonInput>
                </IonItem>
                <IonItem color="light" className="input-login">
                    <IonLabel position="floating">Senha</IonLabel>
                    <IonInput type="password" onIonChange={(e:any) => setSenha(e.target.value)}></IonInput>
                </IonItem>
                <div id="loading-login">{(mostrarLoading ? <IonProgressBar type="indeterminate" color="medium"></IonProgressBar> : '')}</div>
                <IonButton onClick={async()=>{await logar()}} id="botao-login">Entrar</IonButton>
            </div>
            <div id="cadastro-login-container">
                Não tem conta? Cadastre-se! É Grátis!
                <IonButton onClick={()=>{history.push('/cadastro')}} id="botao-cadastro-login">Cadastro</IonButton>
            </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;

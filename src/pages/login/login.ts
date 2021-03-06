import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {HttpStorage} from '../../providers/httpstorage';
import {BuyvipPage} from '../buyvip/buyvip';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  constructor(public alertCtrl: AlertController,
              public navCtrl: NavController,
              public navParams: NavParams,
              public httpstorage: HttpStorage,
              public storage: Storage) {
    this.clear();
    this.loadInAppPurchase();
  }

  account: string = "";
  password: string = "";
  showInAppPurchase: boolean = false;
  pwm: any;
  pwmuser: any;
  pwmopw: any;
  pwmnpw: any;

  pwf: any;
  pwfs: any;
  pwfuser: any;
  pwfyzm: any;
  pwfpwd: any;

  pwr: any;
  pwruser: string = "";
  pwremail: string = "";
  pwrpwd: string = "";

  loadInAppPurchase() {
    var this_ = this;
    this.httpstorage.getHttp('/app/configController.do?getInAppPurchase', (data) => {
      if (data != null) {
        if (data.returnCode === 1) {
          this.httpstorage.setStorage("inAppPurchaseFlag", data.content.value);
          this_.showInAppPurchase = data.content.value === 'on';
        } else {
          this.httpstorage.setStorage("inAppPurchaseFlag", "off");
        }
      } else {
        this.httpstorage.setStorage("inAppPurchaseFlag", "off");
      }
    })
  }

  login() {
    this.httpstorage.getHttp('/app/loginController.do?login&userId=' + this.account + '&userPwd=' + this.password, (data) => {
      console.log(data);
      if (data != null) {
        if (data.returnCode) {
          let user: any = {
            token: data.content.token,
            userId: data.content.userId,
            userName: data.content.userName
          }
          this.storage.set("user", user).then((data)=>{
            this.navCtrl.setRoot(TabsPage);
          }).catch((err)=>{
            this.showAlertCtrl("登录异常："+JSON.stringify(err));
          });
        }
        else {
          let alert = this.alertCtrl.create({
            title: '系统通知',
            subTitle: '账号或密码错误',
            buttons: ['好'],
          });
          alert.present();
        }
      }
      else {
        this.showAlertCtrl("网络异常，请检查网络问题！");
      }
    })
  }

  showAlertCtrl(msg){
    let alert = this.alertCtrl.create({
      title: '系统通知',
      subTitle: msg,
      buttons: ['好'],
    });
    alert.present();
  }

  free() {
    let user: any = {
      token: '',
      userId: '百词斩免登陆测试用户',
      userName: ''
    }
    //this.httpstorage.setStorage("user", user);
    //this.navCtrl.setRoot(TabsPage);
    this.storage.set("user", user).then((data)=>{
      this.navCtrl.setRoot(TabsPage);
    }).catch((err)=>{
      this.showAlertCtrl("登录异常："+JSON.stringify(err));
    });
  }

  clear() {
    this.pwm = false;
    this.pwmuser = "";
    this.pwmopw = "";
    this.pwmnpw = "";
    this.pwf = false;
    this.pwfs = true;
    this.pwfuser = "";
    this.pwfyzm = "";
    this.pwfpwd = "";

    this.pwr = false;
    this.pwruser = "";
    this.pwremail = "";
    this.pwrpwd = "";
  }

  pwfsend() {
    if (this.pwfuser == "") {
      let alert = this.alertCtrl.create({
        title: '系统通知',
        subTitle: '请先输入账号！',
        buttons: ['好'],
        //cssClass:'mid'
      });
      alert.present();
    }
    else {
      this.httpstorage.getHttp("/app/userController.do?sendEmail&userId=" + this.pwfuser, (data) => {
        let alert = this.alertCtrl.create({
          title: '系统通知',
          subTitle: data.msg,
          buttons: ['好'],
          //cssClass:'mid'
        });
        alert.present();
        if (data.returnCode) {
          this.pwfs = false;
        }
      })
    }
  }

  doRegister() {
    if (this.pwruser == "" || this.pwremail == "" || this.pwrpwd == "") {
      let alert = this.alertCtrl.create({
        title: '系统通知',
        subTitle: '请填写完整的注册信息！',
        buttons: ['好'],
      });
      alert.present();
    } else {
      this.httpstorage.getHttp("/app/userController.do?doRegisterUser&username=" + this.pwruser + "&email=" + this.pwremail + "&password=" + this.pwrpwd, (data) => {
        let alert = this.alertCtrl.create({
          title: '系统通知',
          subTitle: data.msg,
          buttons: ['好'],
        });
        alert.present();
      })
    }
  }

  pwfok() {
    if (this.pwfyzm != "" && this.pwfpwd != "")
      this.httpstorage.getHttp("/app/userController.do?doUpdatePwdByEmailCode&userId=" + this.pwfuser + "&newPwd=" + this.pwfpwd + "&emailCode=" + this.pwfyzm, (data) => {
        let alert = this.alertCtrl.create({
          title: '系统通知',
          subTitle: data.msg,
          buttons: ['好'],
          //cssClass:'mid'
        });
        alert.present();
        if (data.returnCode) this.clear();
      })
  }

  pwmok() {
    this.httpstorage.getHttp("/app/userController.do?doUpdatePwdByOldPwd&userId=" + this.pwmuser + "&newPwd=" + this.pwmnpw + "&oldPwd=" + this.pwmopw, (data) => {
      let alert = this.alertCtrl.create({
        title: '系统通知',
        subTitle: data.msg,
        buttons: ['好'],
        //cssClass:'mid'
      });
      alert.present();
      if (data.returnCode) this.clear();
    })
  }

  forget() {
    this.pwf = true;
  }

  mod() {
    this.pwm = true;
  }

  register() {
    this.pwr = true;
  }


  buyvip() {
    this.navCtrl.push(BuyvipPage, {});
  }
}

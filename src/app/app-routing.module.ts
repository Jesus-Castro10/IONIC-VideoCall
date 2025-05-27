import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "@angular/fire/auth-guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'contact-detail/:id',
    loadChildren: () => import('./pages/contact-detail/contact-detail.module').then( m => m.ContactDetailPageModule)
  },
  {
    path: 'incoming-call',
    loadChildren: () => import('./pages/incoming-call/incoming-call.module').then( m => m.IncomingCallPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'add-contact',
    loadChildren: () => import('./pages/add-contact/add-contact.module').then( m => m.AddContactPageModule)
  },
  {
    path: 'edit-contact/:id',
    loadChildren: () => import('./pages/edit-contact/edit-contact.module').then( m => m.EditContactPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'chat/:id',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'test-audio',
    loadChildren: () => import('./pages/test-audio/test-audio.module').then( m => m.TestAudioPageModule)
  },
  {
    path: 'test-location',
    loadChildren: () => import('./pages/test-location/test-location.module').then( m => m.TestLocationPageModule)
  },
  {
    path: 'test-noti',
    loadChildren: () => import('./pages/test-noti/test-noti.module').then( m => m.TestNotiPageModule)
  },
  {
    path: 'test-chat',
    loadChildren: () => import('./pages/test-chat/test-chat.module').then( m => m.TestChatPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

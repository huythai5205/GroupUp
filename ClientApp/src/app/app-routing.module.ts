import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventListComponent } from './pages/event-pages/event-list/event-list.component';
import { EventEditComponent } from './pages/event-pages/event-edit/event-edit.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/user-pages/register/register.component';
import { LoginComponent } from './pages/user-pages/login/login.component';
import { DashboardComponent } from './pages/user-pages/dashboard/dashboard.component';
import { EventDetailsComponent } from './pages/event-pages/event-details/event-details.component';
import { ChangePasswordComponent } from './pages/user-pages/change-password/change-password.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { ForgotPasswordComponent } from './pages/user-pages/forgot-password/forgot-password.component';
import { NotFoundComponent } from './pages/error-pages/not-found/not-found.component';
import { ServerErrorComponent } from './pages/error-pages/server-error/server-error.component';
import { UserEditComponent } from './pages/user-pages/user-edit/user-edit.component';
import { PreventUnsavedChangesGuard } from './shared/guard/prevent-unsaved-changes.guard';
import { MessagesComponent } from './shared/components/messages/messages.component';
import { UploadPicComponent } from './shared/components/upload-pic/upload-pic.component';
import { MemberDetailComponent } from './pages/user-pages/member-detail/member-detail.component';
import { MemberDetailedResolver } from './resolvers/member-detailed.resolver';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user-edit', component: UserEditComponent },
      { path: 'member-detail/:memberId', component: MemberDetailComponent, resolve: { member: MemberDetailedResolver } },
      { path: 'events', component: EventListComponent },
      { path: 'event-edit/:eventId', component: EventEditComponent, canDeactivate: [PreventUnsavedChangesGuard] },
      { path: 'event-detail/:eventId', component: EventDetailsComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'upload-pic', component: UploadPicComponent },
      { path: 'messages', component: MessagesComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: HomeComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { LayoutModule } from '@angular/cdk/layout';

//user pages
import { ForgotPasswordComponent } from './pages/user-pages/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './pages/user-pages/change-password/change-password.component';
import { RegisterComponent } from './pages/user-pages/register/register.component';
import { LoginComponent } from './pages/user-pages/login/login.component';
import { DashboardComponent } from './pages/user-pages/dashboard/dashboard.component';
import { MemberDetailComponent } from './pages/user-pages/member-detail/member-detail.component';
import { UserEditComponent } from './pages/user-pages/user-edit/user-edit.component';

//event pages
import { EventDetailsComponent } from './pages/event-pages/event-details/event-details.component';
import { EventListComponent } from './pages/event-pages/event-list/event-list.component';
import { EventEditComponent } from './pages/event-pages/event-edit/event-edit.component';
import { EventCardComponent } from './pages/event-pages/event-card/event-card.component';

//error pages
import { NotFoundComponent } from './pages/error-pages/not-found/not-found.component';
import { ServerErrorComponent } from './pages/error-pages/server-error/server-error.component';

//forms
import { InputComponent } from './forms/input/input.component';
import { SelectComponent } from './forms/select/select.component';

//services
import {
  AccountService,
  ConfirmService,
  EventService,
  IndexedDBService
} from './shared/services';

//interceptors
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { SuccessInterceptor } from './interceptors/success.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';

//other pages
import { HomeComponent } from './pages/home/home.component';
import MenuNavComponent from './menu-nav/menu-nav.component';

//guards
import { AuthGuard } from './shared/guard/auth.guard';
import { PreventUnsavedChangesGuard } from './shared/guard/prevent-unsaved-changes.guard';

//components 
import { PaginatorComponent } from './shared/components/pagination/paginator.component';
import { UploadPicComponent } from './shared/components/upload-pic/upload-pic.component';
import { MessagesComponent } from './shared/components/messages/messages.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { RolesModalComponent } from './shared/components/roles-modal/roles-modal.component';
import { EventTableComponent } from './shared/components/event-table/event-table.component';
import { MemberTableComponent } from './shared/components/user-table/member-table.component';
import { ChatComponent } from './shared/components/chat/chat.component';

import { GooglePlacesComponent } from './google-places.component';
import { MaterialModule } from './modules/material.module';
import { EventChatComponent } from './shared/components/event-chat/event-chat.component';


@NgModule({
  declarations: [
    AppComponent,
    EventListComponent,
    EventEditComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    MenuNavComponent,
    GooglePlacesComponent,
    EventDetailsComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    NotFoundComponent,
    InputComponent,
    PaginatorComponent,
    ServerErrorComponent,
    UploadPicComponent,
    MessagesComponent,
    ConfirmDialogComponent,
    RolesModalComponent,
    ChatComponent,
    MemberDetailComponent,
    EventCardComponent,
    UserEditComponent,
    SelectComponent,
    EventTableComponent,
    MemberTableComponent,
    EventChatComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    LayoutModule,
    MaterialModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCTAv20qgxgOCCMNMsMfWZaDmXDTJT2vfw'
    })
  ],
  providers: [EventService, AccountService, AuthGuard, IndexedDBService, PreventUnsavedChangesGuard, ConfirmService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SuccessInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

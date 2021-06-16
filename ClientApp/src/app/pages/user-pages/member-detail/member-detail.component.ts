import { Route } from '@angular/compiler/src/core';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { take } from 'rxjs/operators';

import { Member, MemberMessage, User } from 'src/app/shared/models';
import { AccountService, MembersService, MemberMessageService, PresenceService } from 'src/app/shared/services';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  messages: MemberMessage[] = [];
  user: User;

  constructor(
    private membersService: MembersService,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private memberMessageService: MemberMessageService,
    public presence: PresenceService,
    private router: Router
  ) {
    this.loadUser();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data.member;
      console.log(this.member);
    });
  }

  loadUser(): void {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user =>
      this.user = user);
  }

  loadMember(): void {
    this.membersService.getMember(this.route.snapshot.paramMap.get('memberId')).subscribe((member: Member) => this.member = member);
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 1 && this.messages.length === 0) {
      this.memberMessageService.createHubConnection(this.user, this.member.id);
    } else {
      this.memberMessageService.stopHubConnection();
    }
  }

  // getImages(): NgxGalleryImage[] {
  //   const imageUrls = this.member.photoUrl;
  //   // for (const photo of this.member.photoUrl) {
  //   //   imageUrls.push({
  //   //     small: photoUrl,
  //   //     medium: photo?.url,
  //   //     big: photo?.url
  //   //   })
  //   // }
  //   return imageUrls;
  // }

  ngOnDestroy(): void {
    this.memberMessageService.stopHubConnection();
  }

}

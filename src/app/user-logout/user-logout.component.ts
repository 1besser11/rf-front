import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-logout',
  templateUrl: './user-logout.component.html',
  styleUrls: ['./user-logout.component.css']
})
export class UserLogoutComponent implements OnInit {

  constructor(private userService: UserService,
    private router: Router) { }

  onSubmit() {
    this.userService.logout();
    
  }

  ngOnInit() {
  }


}

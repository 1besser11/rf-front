import { UserService } from '../user.service';
import { User } from '../user';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {

  user: User = new User();
  submitted = false;
  successful = false;

  constructor(private userService: UserService,
    private router: Router) { }

  ngOnInit() {
  }

  newUser(): void {
    this.submitted = false;
    this.user = new User();
  }

  save() {
    console.log("saved");
    this.userService.registerUser(this.user)
      .subscribe(data => 
        {
          console.log(data);
          this.successful = true;
        }, error => {
          console.log(error);
          console.log(error.error.object);
          this.user = error.error.object;
        });
    this.user = new User();
    
  }

  onSubmit() {
    console.log("submitted")
    this.submitted = true;
    this.save();    
  }

  gotoLogin() {
    this.router.navigate(['login']);
  }
}

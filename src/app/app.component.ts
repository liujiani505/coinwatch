import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string = "coinwatch"
  selectedcurrency: string ='USD';

  constructor(){}

  sendCurrency(event:string){
    console.log(event);
  }
}

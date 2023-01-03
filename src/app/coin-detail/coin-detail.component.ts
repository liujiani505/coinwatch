import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../service/api.service';
import { ChartConfiguration, ChartType} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CurrencyService } from '../service/currency.service'; 

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss']
})
export class CoinDetailComponent implements OnInit {

  coinData: any;
  coinId! :string;
  days: number = 1;
  currency: string = "USD";

  public lineChartData: ChartConfiguration['data'] = {
    datasets:[
      {
        data:[],
        label: 'Price Trends',
        backgroundColor: '#B7F200',
        pointBackgroundColor:'#B7F200',
        pointBorderColor: '#B7F200',
        pointHoverBackgroundColor: '#B7F2008',
        pointHoverBorderColor: '#B7F200',
        borderColor: '#B7F200',

      }
    ],
    labels:[] 
  }

  public lineChartOptions: ChartConfiguration['options'] ={
    elements:{
      point:{
        radius:1
      }
    },
    plugins: {
      legend: { display: true},
    }
  }

  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) lineChart !: BaseChartDirective;

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute, private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(val =>{
      this.coinId = val['id'];
    })
    this.getCoinData();
    this.getGraphData();
    this.currencyService.getCurrency()
    .subscribe( val => {
      this.currency = val;
      this.getGraphData();
      this.getCoinData();
    })
  }

  getCoinData(){
    this.api.getCurrencyById(this.coinId)
    .subscribe(res => {
      console.log(this.coinData)
      switch (this.currency){
        case "EUR":
          res.market_data.current_price.usd = res.market_data.current_price.eur
          res.market_data.market_cap.usd = res.market_data.market_cap.eur
          break;
        case "JPY":
          res.market_data.current_price.usd = res.market_data.current_price.jpy
          res.market_data.market_cap.usd = res.market_data.market_cap.jpy
          break;
        case "GBP":
          res.market_data.current_price.usd = res.market_data.current_price.gbp
          res.market_data.market_cap.usd = res.market_data.market_cap.gbp
          break;
        default:
          res.market_data.current_price.usd = res.market_data.current_price.usd
          res.market_data.market_cap.usd = res.market_data.market_cap.usd
      }
      this.coinData = res;
    })
  }

  getGraphData(){
    this.api.getGraphicalCurrencyData(this.coinId, this.currency, 1)
    .subscribe(res => {
      setTimeout(()=>{
        this.lineChart.chart?.update();
      }, 200)
      // console.log(res)
      this.lineChartData.datasets[0].data = res.prices.map((a:any) => {
        return a[1];
      });
      this.lineChartData.labels = res.prices.map((a:any) => {
        let date = new Date(a[0]);
        let time = date.getHours() > 12 ? `${date.getHours() -12} : ${date.getMinutes()} PM` : `${date.getHours()} : ${date.getMinutes()} AM`
        return this.days === 1 ? time : date.toLocaleDateString();
      })
    })
  }

}

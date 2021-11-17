import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-try',
  templateUrl: './try.component.html',
  styleUrls: ['./try.component.css']
})

export class TryComponent implements OnInit {
  chartData = {
    type: 'LineChart',
    data: [
    ["PHP Books",  500],
    [".Net Books",  800],
    ["Java Books",  400],
 ],
 chartColumns: ['Books', 'Sell'],
 width: 1000,
 height: 400
};
  ngOnInit() {
  }
}

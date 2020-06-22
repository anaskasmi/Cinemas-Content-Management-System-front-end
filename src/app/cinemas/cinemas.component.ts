import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CinemasService} from "../services/cinemas.service";
import {error} from "@angular/compiler/src/util";
import Swal from "sweetalert2";

@Component({
  selector: 'app-cinemas',
  templateUrl: './cinemas.component.html',
  styleUrls: ['./cinemas.component.css']
})
export class CinemasComponent implements OnInit {
  public villes;
  public cinemas;
  public salles;
  public currentVille;
  public currentCinema;
  public currentProjection;
  public selectedTickets: any[];

  constructor(public CinemaService: CinemasService) {
  }

  ngOnInit(): void {
    this.CinemaService.getVilles()
      .subscribe(data => {
        this.villes = data;
      }, error => {
        console.log(error)
      });
  }

  public onGetCinemas(v) {
    this.currentVille = v;
    this.salles = undefined;

    this.CinemaService.getCinemas(v)
      .subscribe(data => {
        this.cinemas = data;
      }, error => {
        console.log(error)
      });
  }

  public onGetSalles(c) {
    this.currentCinema = c;
    this.CinemaService.getSalles(c)
      .subscribe(data => {
        this.salles = data;
        this.salles._embedded.salles.forEach(salle => {
          this.CinemaService.getProjections(salle)
            .subscribe(data => {
                salle.projections = data;
              },
              error => {
                console.log(error);
              })
        });
      }, error => {
        console.log(error)
      });
  }


  onGetTicketPlaces(p) {
    this.currentProjection = p;
    this.CinemaService.getTicketPlaces(p)
      .subscribe(data => {
          this.currentProjection.tickets = data;
          this.selectedTickets = [];
        },
        error => {
          console.log(error);
        }
      )
  }

  onSelectTicket(t) {
    if (!t.selected) {
      t.selected = true;
      this.selectedTickets.push(t);
    } else {
      t.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t), 1);
    }
  }

  getTicketClass(t) {
    let str = "btn m-2 float-left ";
    if (t.reserve) {
      str += "btn-secondary "
    } else if (!t.selected) {
      str += "btn-outline-info "
    } else if (t.selected) {
      str += "btn-info ";

    }
    return str;

  }

  onPayTickets(dataForm) {
    let ticketsIds = [];
    this.selectedTickets.forEach((t) => {
      ticketsIds.push(t.id);
    });
    dataForm.tickets = ticketsIds;

    this.CinemaService.payerTickets(dataForm)
      .subscribe(data => {
        Swal.fire(
          'Success',
          'Tickets added to your account successfully !',
          'success'
        );
        this.onGetTicketPlaces(this.currentProjection);

      }, error => {
        Swal.fire(
          'error',
          'Something went wrong !',
          'error'
        )
        console.log(error);
      });
  }
}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CinemasService {

  public host:string = "http://199.192.21.20:8383";
  constructor(private http:HttpClient) {

  }

  public getVilles()
  {
    return this.http.get(this.host+"/villes");
  }

  public getCinemas(v) {
    return this.http.get(v._links.cinemas.href);
  }

  getSalles(c) {
    return this.http.get(c._links.salles.href);
  }

  getProjections(salle) {
     let url = salle._links.projections.href.replace("{?projection}","");
    return this.http.get(url+"?projection=p1");
  }

  getTicketPlaces(p) {
    let url = p._links.tickets.href.replace("{?projection}","");
    return this.http.get(url+"?projection=ticketProj");

  }

  payerTickets(dataForm) {
    return this.http.post(this.host+"/payerTickets",dataForm);
  }
}

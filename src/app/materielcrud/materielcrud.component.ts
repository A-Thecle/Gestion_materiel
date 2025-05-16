import { HttpClient, HttpClientModule} from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { registerables } from 'chart.js'; 
declare var bootstrap: any;
@Component({
  standalone: true,
  selector: 'app-materielcrud',
  imports: [FormsModule, HttpClientModule, CommonModule], 
  templateUrl: './materielcrud.component.html',
  styleUrls: ['./materielcrud.component.scss']
})

export class MaterielcrudComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChart') pieChartRef!: ElementRef;
  @ViewChild('formModal') formModal!: ElementRef;
modalInstance: any;
        materielArray : any []=[];
        isResultLoaded = false;
        isUpdateFormActive = false;
         design: string = "";
        etat: string = "";
        quantite!:number ;
        numeroMateriel! :number | undefined;
        totalQuantite: number = 0;
          nbBon: number = 0;
          nbMauvais: number = 0;
          nbAbime: number = 0;

          // Charts
  pieChart: any;


        constructor(private http: HttpClient){
          Chart.register(...registerables);
           
        }

        ngOnInit():void{
        
            this.getStats();
            setInterval(() => {
              this.getStats();
            }, 5000);
            this.getAllMateriel ();
            this.initChart();
        
        }
        
        openModal() {
          this.modalInstance.show();
        }
      
        closeModal() {
          this.modalInstance.hide();
        }



     ngAfterViewInit(): void {
      this.initChart();
      this.modalInstance = new bootstrap.Modal(this.formModal.nativeElement);
      }
        public getAllMateriel():void{
          this.http.get("http://localhost:8888/materiel/liste").subscribe((resultData: any)=>{
            this.isResultLoaded = true;
            console.log(resultData.data);
            this.materielArray = resultData.data
          })
        }

        public ajouter():void {
             
  if (!this.design || !this.etat || this.quantite === null || this.quantite <= 0) {
    alert("Veuillez remplir tous les champs correctement !");
    return;
  }
          let bodyforms = {
            "design" : this.design,
            "etat" : this.etat,
            "quantite" : this.quantite
          }

          this.http.post("http://localhost:8888/materiel/ajout", bodyforms).subscribe((result:any)=>{
            console.log(result);
            alert("Matériel Ajouté avec succès")
            this.getAllMateriel();
            this.closeModal();
            this.resetForm();
          })
        }
        resetForm() {
          this.design = '';
          this.etat = '';
          this.quantite = 0;
          this.numeroMateriel = undefined;
      }


        setUpdate(data: any){
          this.openModal()
          if (!data || !data.numeroMateriel) {
            console.error("Erreur : numéro du matériel invalide", data);
            alert("Erreur : numéro du matériel invalide");
            
            return;
        }
    
        console.log("Matériel sélectionné pour mise à jour :", data);
          this.design = data.design;
          this.etat = data.etat;
          this.quantite = data.quantite;
           this.numeroMateriel = data.numeroMateriel
           console.log("Numéro de matériel défini :", this.numeroMateriel);
        }

        updateMateriel() {
          if (!this.numeroMateriel) {
              console.error("Erreur : numeroMateriel est undefined !");
              alert("Erreur : Numéro du matériel non défini !");
              return;
          }
      
          const quantiteNumber = Number(this.quantite);
          if (isNaN(quantiteNumber)) {
              alert("La quantité doit être un nombre valide");
              return;
          }
      
          const bodyData = {
              design: this.design,
              etat: this.etat,
              quantite: quantiteNumber  // Notez le changement de 'quantite' à 'quantite'
          };
      
          console.log("Envoi de la requête PUT avec :", this.numeroMateriel, bodyData);
      
          const headers = { 'Content-Type': 'application/json' };
      
          this.http.put(`http://localhost:8888/materiel/update/${this.numeroMateriel}`, bodyData, 
                       { headers })
              .subscribe({
                  next: (result: any) => {
                      console.log("Réponse du serveur:", result);
                      if (result.status) {
                          alert("Matériel mis à jour avec succès");
                          this.getAllMateriel();
                          this.resetForm();
                          this.closeModal()
                      } else {
                          alert(`Erreur: ${result.message}`);
                      }
                  },
                  error: (err) => {
                      console.error("Erreur complète:", err);
                      if (err.error) {
                          alert(`Erreur serveur: ${err.error.message || err.message}`);
                      } else {
                          alert("Erreur inconnue lors de la mise à jour");
                      }
                  }
              });
      }

      save() {
        console.log("Save called - numeroMateriel:", this.numeroMateriel);
        
        // Vérification plus robuste
        if (this.numeroMateriel === undefined || this.numeroMateriel === null || isNaN(this.numeroMateriel)) {
            this.ajouter();
        } else {
            this.updateMateriel();
        }
    }
    setDelete(numeroMateriel: number) {
      console.log("Suppression du matériel avec numéro :", numeroMateriel);
    
      if (!numeroMateriel || isNaN(numeroMateriel)) {
        console.error("Numéro du matériel invalide :", numeroMateriel);
        return;
      }
    
      // Afficher une boîte de confirmation
      const confirmation = confirm("Voulez-vous vraiment supprimer ce matériel ?");
    
      if (!confirmation) {
        console.log("Suppression annulée par l'utilisateur.");
        return;
      }
    
      this.http.delete("http://localhost:8888/materiel/suppression/" + numeroMateriel)
        .subscribe((result: any) => {
          console.log("Matériel supprimé");
          alert("Matériel supprimé");
          this.getAllMateriel();
        }, (error) => {
          console.error("Erreur lors de la suppression :", error);
          alert("Échec de la suppression du matériel.");
        });
    }
    
  //méthode getStats
public getStats(): void {
  this.http.get<any>("http://localhost:8888/materiel/stats").subscribe({
      next: (resultData) => {
          console.log("Stats reçues:", resultData);
          this.totalQuantite = resultData.totalQuantite || 0;
          this.nbBon = resultData.bon || 0;
          this.nbMauvais = resultData.mauvais || 0;
          this.nbAbime = resultData.abime || 0;
          this.initChart(); 
      },
      error: (err) => {
          console.error("Erreur API Stats:", err);
          // Initialisation des valeurs par défaut en cas d'erreur
          this.totalQuantite = 0;
          this.nbBon = 0;
          this.nbMauvais = 0;
          this.nbAbime = 0;
           
          this.initChart();
          if (err.status === 404) {
              alert("Endpoint des statistiques non trouvé. Vérifiez le serveur.");
          } else {
              alert("Erreur lors de la récupération des statistiques.");
          }
      }
  });
}



initChart(): void {
  if (!this.pieChartRef?.nativeElement) {
    console.error('Element pieChart non trouvé');
    return;
  }

  // Détruire le chart existant
  if (this.pieChart) {
    this.pieChart.destroy();
  }

  this.pieChart = new Chart(this.pieChartRef.nativeElement, {
    type: 'pie',
    data: {
      labels: ['Bon', 'Mauvais', 'Abimé'],
      datasets: [{
        data: [this.nbBon, this.nbMauvais, this.nbAbime],
        backgroundColor: [
          '#328E6E',
          '#ff6384',
          '#333'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'État des matériels',
          font: {
            size: 16
          }
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}
}




    


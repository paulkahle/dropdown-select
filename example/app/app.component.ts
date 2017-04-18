import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup , FormControl} from '@angular/forms';


@Component({
  selector: 'supre-root',
  templateUrl: './app.component.html',
  providers: [FormBuilder]
})
export class AppComponent {

  public availableHeroes: Array<any> = [
    {text : 'Luke Skywalker', value : 'luke'},
    {text : 'Han Solo', value : 'han'},
    {text : 'Princess Leia', value : 'leia'},
    {text : 'Chewbacca', value : 'chewy'},
    {text : 'Obiwan Kenobi', value : 'obiwan'},
    {text : 'Yoda', value : 'yoda'}
  ];

  public availableVillains: Array<any> = [
    {text : 'Darth Vader', value : 'darth'},
    {text : 'Emperor Palpatine', value : 'emperor'},
    {text : 'Governor Tarkin', value : 'tarkin'},
    {text : 'Jabba the Hut', value : 'jabba'},
    {text : 'Boba Fett', value : 'boba'}
  ];

  public availableDroids: Array<any> = [
    {text : 'R2D2', value : 'r2d2'},
    {text : 'C3PO', value : 'c3po'},
    {text : 'BB-8', value : 'bb8'},
    {text : 'K2SO', value : 'k2so'}
  ];

  public availablePlanets: Array<any> = [
    {text : 'Tatooine', value : 'tatooine'},
    {text : 'Hoth', value : 'hoth'},
    {text : 'Coruscant', value : 'coruscant'},
    {text : 'Jedda', value : 'jedda'}
  ];

  public model: any = {
    heroes: [],
    villains: [],
    droids: [],
    planets: []
  }

  private planelLabelFn = function(selectedItems, allSelected){
    if (allSelected){
      return 'Congrats! You selected All Planets!';
    } else if (!selectedItems.length){
      return 'No planets?  What\'s your problem?';
    }else if (selectedItems.length === 1){
      return 'That is a truly pathetic number of planets!';
    }else if (selectedItems.length === 2) {
      return 'Come on! You can select more than that!';
    } else {
      return 'Select some more planets to get a free toaster.';
    }
  }


  private form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
      this.form = formBuilder.group(this.model);

      this.form.valueChanges.subscribe(
        data => {
          this.model.heroes = data.heroes || [];
          this.model.villains = data.villains || [];
          this.model.droids = data.droids || [];
          this.model.planets = data.planets || [];
        }
      );
  }
}

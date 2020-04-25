import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainThreeComponent } from './main-three/main-three.component';


const routes: Routes = [
  { path: '', component: MainThreeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

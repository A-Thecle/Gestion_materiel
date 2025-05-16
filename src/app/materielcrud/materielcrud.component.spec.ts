import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterielcrudComponent } from './materielcrud.component';

describe('MaterielcrudComponent', () => {
  let component: MaterielcrudComponent;
  let fixture: ComponentFixture<MaterielcrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterielcrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterielcrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

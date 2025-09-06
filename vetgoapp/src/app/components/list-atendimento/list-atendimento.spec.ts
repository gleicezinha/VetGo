import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListAtendimentoComponent } from './list-atendimento';

describe('ListAtendimentoComponent', () => {
    let component: ListAtendimentoComponent;
    let fixture: ComponentFixture<ListAtendimentoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ListAtendimentoComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ListAtendimentoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
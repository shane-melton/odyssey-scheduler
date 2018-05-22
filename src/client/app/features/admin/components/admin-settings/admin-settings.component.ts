import { Component, OnInit } from '@angular/core';
import { ScrollSpy} from 'materialize-css';
import { IBlockDto } from '@shared/interfaces/scheduler/IBlock';
import { BlockService } from '@client/core/blocks/block.service';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {

  blocks: IBlockDto[];

  constructor(private blockService: BlockService) { }

  ngOnInit() {
    ScrollSpy.init(document.querySelectorAll('.scrollspy'), {
      getActiveElement: function (id) {
        return 'a[appToc="' + id + '"]';
      }
    });

    this.loadData();
  }

  loadData() {
    this.blockService.listBlocks().subscribe(blocks => this.blocks = blocks);
  }

}

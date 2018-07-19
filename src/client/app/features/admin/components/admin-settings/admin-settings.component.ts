import { Component, OnInit } from '@angular/core';
import { ScrollSpy} from 'materialize-css';
import { BlockService } from '@client/core/blocks/block.service';
import { IApiResult } from '@shared/interfaces/api';
import { BlockDto } from '@client/dtos/BlockDto';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {

  blocks: BlockDto[] = [];
  loadingBlocks = true;

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
    this.loadingBlocks = true;
    this.blockService.listBlocks().subscribe(blocks => {
      this.blocks = blocks;
      this.loadingBlocks = false;
    });
  }

  deleteBlock(block: BlockDto) {
    if (!confirm(`Are you sure you want to delete the block '${block.name}'?`)) {
      return;
    }
    this.blockService.deleteBlock(block.id).subscribe((result: IApiResult) => {
      if (result.success) {
        this.loadData();
      } else {
        alert(result.errorMsg);
      }
    });
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BlockDto, IBlockDto} from '@shared/interfaces/scheduler/IBlock';
import { Observable } from 'rxjs/Observable';
import { IApiResult } from '@shared/interfaces/api';
import { BlockApi } from '@shared/api-endpoints';
import { map } from 'rxjs/operators';
import { BlockDocument } from '@server/modules/blocks/block.schema';
import * as _ from 'underscore';
import * as moment from 'moment';

@Injectable()
export class BlockService {

  constructor(private readonly http: HttpClient) { }

  createBlock(newBlockDto: IBlockDto): Observable<IApiResult> {
    newBlockDto.endTime = moment(newBlockDto.endTime, 'HH:mm A').toDate();
    newBlockDto.startTime = moment(newBlockDto.startTime, 'HH:mm A').toDate();
    return this.http.post<IApiResult>(BlockApi.postCreateBlock, newBlockDto);
  }

  updateBlock(updateBlockDto: IBlockDto): Observable<IApiResult> {
    updateBlockDto.endTime = moment(updateBlockDto.endTime, 'HH:mm A').toDate();
    updateBlockDto.startTime = moment(updateBlockDto.startTime, 'HH:mm A').toDate();
    return this.http.post<IApiResult>(BlockApi.postUpdateBlock, updateBlockDto);
  }

  deleteBlock(blockId: string): Observable<IApiResult> {
    return this.http.delete<IApiResult>(BlockApi.deleteBlock(blockId));
  }

  listBlocks(): Observable<BlockDto[]> {
    return this.http.get<IApiResult<BlockDto[]>>(BlockApi.getListBlocks)
      .pipe(
        map((res) => {
          return res.success ? res.data : [];
        }),
        map((blocks: any[]) => {
          return _.map(blocks, (doc: BlockDocument) => BlockDto.fromBlockDoc(doc));
        })
      );
  }

}

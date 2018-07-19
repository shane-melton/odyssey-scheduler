import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IApiResult } from '@shared/interfaces/api';
import { BlockApi } from '@shared/api-endpoints';
import { map } from 'rxjs/operators';
import * as _ from 'underscore';
import * as moment from 'moment';
import { IBlock } from '@shared/interfaces/models/IBlock';
import { BlockDto } from '@client/dtos/BlockDto';

@Injectable()
export class BlockService  {

  constructor(private readonly http: HttpClient) { }

  createBlock(newBlockDto: IBlock): Observable<IApiResult> {
    newBlockDto.endTime = moment(newBlockDto.endTime, 'HH:mm A').toDate();
    newBlockDto.startTime = moment(newBlockDto.startTime, 'HH:mm A').toDate();
    return this.http.post<IApiResult>(BlockApi.postCreateBlock, newBlockDto);
  }

  updateBlock(updateBlockDto: IBlock): Observable<IApiResult> {
    updateBlockDto.endTime = moment(updateBlockDto.endTime, 'HH:mm A').toDate();
    updateBlockDto.startTime = moment(updateBlockDto.startTime, 'HH:mm A').toDate();
    return this.http.post<IApiResult>(BlockApi.postUpdateBlock, updateBlockDto);
  }

  deleteBlock(blockId: string): Observable<IApiResult> {
    return this.http.delete<IApiResult>(BlockApi.deleteBlock(blockId));
  }

  listBlocks(): Observable<BlockDto[]> {
    return this.http.get<IApiResult<IBlock[]>>(BlockApi.getListBlocks)
      .pipe(
        map((res) => {
          return res.success ? res.data : [];
        }),
        map((blocks: any[]) => {
          return _.map(blocks, (block: IBlock) => new BlockDto(block));
        })
      );
  }

}

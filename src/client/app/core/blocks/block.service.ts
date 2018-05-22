import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICreateBlockDto, IBlockDto } from '@shared/interfaces/scheduler/IBlock';
import { Observable } from 'rxjs/Observable';
import { IApiResult } from '@shared/interfaces/api';
import { BlockApi } from '@shared/api-endpoints';
import { map } from 'rxjs/operators';
import { BlockDocument } from '@server/modules/blocks/block.schema';
import * as _ from 'underscore';

@Injectable()
export class BlockService {

  constructor(private readonly http: HttpClient) { }

  createBlock(newBlocDto: ICreateBlockDto): Observable<IApiResult> {
    return this.http.post<IApiResult>(BlockApi.postCreateBlock, newBlocDto);
  }

  listBlocks(): Observable<IBlockDto[]> {
    return this.http.get<IApiResult<IBlockDto[]>>(BlockApi.getListBlocks)
      .pipe(
        map((res) => {
          return res.success ? res.data : [];
        }),
        map((blocks: any[]) => {
          return _.map(blocks, (doc: BlockDocument) => IBlockDto.fromBlockDoc(doc));
        })
      );
  }

}

import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {Subject} from 'rxjs/Subject';

// export function FromReadableStream(readable: ReadableStream): Observable {
//   return Observable.create(function (observer: Subscriber<any>) {
//     readable.remo
//   });
// }

export function streamToRx<T>(stream: NodeJS.ReadableStream): Subject<T> {
  const subject = new Subject<T>();
  stream.on('end', () => subject.complete());
  stream.on('error', (e: Error) => subject.error(e));
  stream.on('data', (data: T) => subject.next(data));
  return subject;
}

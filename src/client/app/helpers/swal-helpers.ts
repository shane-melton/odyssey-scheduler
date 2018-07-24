import swal from 'sweetalert';

export async function ConfirmDelete(msg: string = 'Are you sure?'): Promise<boolean> {
  return await swal(msg, {
    dangerMode: true,
    buttons: ['Cancel', 'Delete']
  });
}

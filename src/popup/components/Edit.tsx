import * as React from 'react';

const TABLE_NAME = process.env.REACT_APP_TABLE_NAME;

import Context, { ContextType } from '../../store/context';
import { EDIT_RECORD, UPDATE_ROW, DELETE_ROW } from '../../store/actions';
import {
  getTimeObjectFromFraction,
  getTimeObjectFromSeconds,
  getSeconds,
  getFraction,
  Time,
} from '../../utils/converTime';

export interface EditProps {
  timer?: number;
}

const Edit = ({ timer }: EditProps): JSX.Element => {
  const { state, dispatch } = React.useContext<ContextType>(Context);
  const [selectionRange, setSelectionRange] = React.useState<boolean>(false);
  const [hours, setHours] = React.useState<string>('');
  const [minutes, setMinutes] = React.useState<string>('');
  const [seconds, setSeconds] = React.useState<string>('');

  const descriptionRef = React.useRef<HTMLInputElement>(null);
  const timerRef = React.useRef<HTMLInputElement>(null);
  const hoursRef = React.useRef<HTMLInputElement>(null);
  const minutesRef = React.useRef<HTMLInputElement>(null);
  const secondsRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const { hours, minutes, seconds }: any = timer
      ? getTimeObjectFromSeconds(timer)
      : getTimeObjectFromFraction(state.editRecord.time);

    setHours(hours);
    setMinutes(minutes);
    setSeconds(seconds);
    setSelectionRange(true);
  }, [timer]);

  React.useEffect(() => {
    if (state.editRecord) {
      hoursRef.current.setSelectionRange(0, 2);
      hoursRef.current.focus();
    } else {
      timerRef.current.disabled = true;
      hoursRef.current.disabled = true;
      minutesRef.current.disabled = true;
      secondsRef.current.disabled = true;
      descriptionRef.current.setSelectionRange(0, 0);
      descriptionRef.current.focus();
    }
  }, [selectionRange]);

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
    const regex = /^[0-9\b]+$/;

    if (target.value === '' || regex.test(target.value)) {
      switch (target.name) {
        case 'hours':
          +target.value <= 12 && setHours(target.value);
          break;
        case 'minutes':
          +target.value <= 59 && setMinutes(target.value);
          break;
        case 'seconds':
          +target.value <= 59 && setSeconds(target.value);
          break;
        default:
          break;
      }

      const time = `${hours}:${minutes}:${seconds}`;
      console.log(getSeconds(time));
      dispatch({
        type: EDIT_RECORD,
        payload: {
          showEdit: true,
          record: { ...state.editRecord, time: getSeconds(time) },
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const time = `${hours}:${minutes}:${seconds}`;

    dispatch({
      type: UPDATE_ROW,
      payload: {
        showEdit: false,
        record: { ...state.editRecord, time: getFraction(getSeconds(time)) },
      },
    });
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-white'>
      <form className='relative w-full max-w-sm mx-auto' onSubmit={handleSubmit}>
        <div
          ref={timerRef}
          className='w-full p-3 my-3 text-lg text-3xl font-medium text-center border rounded-md hover:border-blue-500 focus-within:border-blue-500 focus:outline-none'
          onFocus={(): void => {
            timerRef.current.classList.add('shadow-outline');
          }}
          onBlur={(): void => {
            timerRef.current.classList.remove('shadow-outline');
          }}
        >
          <span className='flex flex-no-wrap items-center justify-center w-1/2 m-auto text-center focus-within:border-blue-500'>
            <input
              ref={hoursRef}
              type='text'
              maxLength={2}
              className='w-1/4 text-center focus:outline-none'
              name='hours'
              value={hours}
              onChange={handleChange}
              // onBlur={(e) => {
              //   console.log(e.target.value);
              //   e.target.value === '' ? setHours('00') : null;
              // }}
            />
            :
            <input
              ref={minutesRef}
              type='text'
              maxLength={2}
              className='w-1/4 text-center focus:outline-none'
              name='minutes'
              value={minutes}
              onChange={handleChange}
              // onBlur={(e) => {
              //   console.log(e.target.value);
              //   e.target.value === '' ? setMinutes('00') : null;
              // }}
            />
            :
            <input
              ref={secondsRef}
              type='text'
              maxLength={2}
              className='w-1/4 text-center focus:outline-none'
              name='seconds'
              value={seconds}
              onChange={handleChange}
              // onBlur={(e) => {
              //   console.log(e.target.value);
              //   e.target.value === '' ? setSeconds('00') : null;
              // }}
            />
          </span>
        </div>
        <input
          ref={descriptionRef}
          className='w-full p-3 my-2 text-base font-normal font-medium text-gray-700 border rounded-md hover:border-blue-500 focus:outline-none focus:shadow-outline'
          placeholder='Add description'
          value={state.editRecord ? state.editRecord.description : state.lastRecord.description}
          onChange={(e) => {
            dispatch({
              type: EDIT_RECORD,
              payload: {
                showEdit: true,
                record: { ...state.editRecord, description: e.target.value },
              },
            });
          }}
        />

        <input
          className='w-full p-3 my-2 text-base font-normal font-medium text-gray-700 border rounded-md hover:border-blue-500 focus:outline-none focus:shadow-outline'
          placeholder='Add project'
          value={state.editRecord ? state.editRecord.project : state.lastRecord.project}
          onChange={(e) => {
            dispatch({
              type: EDIT_RECORD,
              payload: {
                showEdit: true,
                record: { ...state.editRecord, project: e.target.value },
              },
            });
          }}
        />

        <input
          className='w-full p-3 my-2 text-base font-normal font-medium text-gray-700 border rounded-md hover:border-blue-500 focus:outline-none focus:shadow-outline'
          placeholder='Add ticket'
          value={state.editRecord ? state.editRecord.ticket : state.lastRecord.ticket}
          onChange={(e) => {
            dispatch({
              type: EDIT_RECORD,
              payload: {
                showEdit: true,
                record: { ...state.editRecord, ticket: e.target.value },
              },
            });
          }}
        />

        <div className='flex flex-col items-center justify-between w-full pt-4 mt-8 border-t'>
          <button
            type='submit'
            className='w-full py-3 text-base text-white bg-blue-600 border border-blue-600 rounded-md shadow-md hover:border-blue-700 hover:bg-blue-700 focus:outline-none focus:shadow-outline'
          >
            Done
          </button>
          <div className='flex items-center w-full my-3'>
            <button
              className='w-1/2 py-3 mr-1 text-base text-gray-600 border border-gray-600 rounded-md shadow-md hover:bg-gray-200 focus:outline-none focus:shadow-outline'
              onClick={(): void =>
                dispatch({
                  type: EDIT_RECORD,
                  payload: {
                    showEdit: false,
                    record: null,
                  },
                })
              }
            >
              Cancel
            </button>
            <button
              className='w-1/2 py-3 ml-1 text-base text-white bg-red-600 border border-red-600 rounded-md shadow-md hover:border-red-700 hover:bg-red-700 focus:outline-none focus:shadow-outline'
              onClick={(): void => {
                const index = state.editRecord
                  ? state.editRecord.id.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2')
                  : state.lastRecord.id.replace(`${TABLE_NAME}!A`, '');
                dispatch({
                  type: DELETE_ROW,
                  payload: {
                    index,
                    id: state.editRecord.id,
                  },
                });
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Edit;

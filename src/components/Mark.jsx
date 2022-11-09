import {
  TrashIcon,
  PencilSquareIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import ky from 'ky';
import { useEffect, useReducer, useRef } from 'react';
import { useData } from '../hooks/data-context';

export const Mark = ({ book, mark }) => {
  const { saveMark, removeMark } = useData();
  const [isEditing, toggleEditing] = useReducer((pre) => !pre, !mark.id);
  const urlRef = useRef();

  const scrapOg = async (url) => {
    // const html = await ky(`https://proxy.cors.sh/${url}`).text();
    // // const html = await ky(`https://cors-anywhere.herokuapp.com/${url}`).text();
    // // console.log('html>>', html);
    // const ogs = html.match(/<meta property="og:(.*?)>/gi);
    // console.log(ogs);
    // const kv = ogs.map((og) =>
    //   og.match(/["|'](.*?)["|']/g).map((s) => s.replace(/(["|']|(og:))/g, ''))
    // );
    // console.log('kv>>', kv);
    return await ky(`https://sz.topician.com/sz/proxy?url=${url}`).json();
  };

  const save = (evt) => {
    evt.stopPropagation();

    if (isEditing) {
      const url = urlRef.current.value;
      mark.image = null;
      mark.title = 'TTT';
      mark.description = 'DDD';
      mark.url = url;
      scrapOg(url).then((ogRet) => {
        console.log('ogRet>>>', ogRet);
        mark.title = ogRet.title || 'No Title';
        mark.image = ogRet.image;
        mark.description = ogRet.description;
        saveMark(book, mark);
      });
    }
    toggleEditing();
  };

  const remove = (evt) => {
    evt.stopPropagation();
    if (confirm('정말 삭제시겠어요?')) removeMark(book, mark.id);
  };

  const openSite = () => {
    // console.log('openSite!!>>>', mark);
    if (!isEditing) window.open(mark.url, '_blank');
  };

  useEffect(() => {
    if (urlRef.current)
      urlRef.current.value = mark.url || 'https://tailwindcss.com';
  }, [isEditing]);

  return (
    <div
      onClick={openSite}
      aria-hidden='true'
      className='group mb-1 box-border cursor-pointer rounded border-2 border-cyan-400 bg-slate-50 p-1 hover:bg-slate-200'
    >
      {isEditing ? (
        <>
          <input
            type='text'
            ref={urlRef}
            className='mb-2 w-full rounded p-1.5'
            placeholder='https://....'
          />
        </>
      ) : (
        <div>
          <div>
            {mark.image && (
              <img
                src={mark.image}
                alt={mark.title}
                className='max-h-[100px] w-full'
              />
            )}
          </div>
          <h3 className='m-1 truncate font-medium text-slate-700'>
            {mark.title}
          </h3>
          <p className='rounded0 m-1 truncate text-sm text-slate-500'>
            {mark.description}
          </p>
        </div>
      )}
      <div
        className={`item-center mr-3 ${
          isEditing ? 'flex' : 'hidden'
        } justify-end group-hover:flex`}
      >
        <button
          onClick={save}
          className='mb-1 mr-1 rounded-full bg-cyan-400 p-2 hover:bg-cyan-600'
        >
          <PencilSquareIcon className='h-4 text-white' />
        </button>
        <button
          onClick={remove}
          className='mb-1 rounded-full bg-rose-400 p-2 hover:bg-rose-500'
        >
          <TrashIcon className='h-4 text-white' />
        </button>
        {isEditing && (
          <button
            onClick={(evt) => {
              evt.stopPropagation();
              toggleEditing();
            }}
            className='mx-1 mb-1 rounded-full bg-slate-300 p-2 hover:bg-slate-500'
          >
            <ArrowUturnLeftIcon className='h-4 text-white' />
          </button>
        )}
      </div>
    </div>
  );
};

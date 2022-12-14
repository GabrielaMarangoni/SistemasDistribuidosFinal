import 'remixicon/fonts/remixicon.css';
import React, { useEffect, useState } from "react"
import router, { useRouter } from 'next/router';
import { divCommentary, divGeneral, divStyleTitle, line, textLocation, textTitle } from "./styles"
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { IPlace } from '../../models/IPlace';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { TextArea } from '../../components/TextArea';
import Commentary from '../../components/Commentary';
import api from '../../services/api';
import { HStack, Spinner } from '@chakra-ui/react';

type CommentaryType = {
  commentary: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  openAddModal: boolean;
}

export default function Search() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [place, setPlace] = useState<IPlace>({} as IPlace);
  const [starButton, setStarButton] = useState(false);
  const [commentaryStates, setCommentaryStates] = useState<CommentaryType>({ } as CommentaryType);
  
  function handleButtonAddCommentary(){
    setCommentaryStates({...commentaryStates, openAddModal: !commentaryStates.openAddModal});
  }

  async function handleAddCommentary() {
    if(commentaryStates.commentary){
     
      
    handleButtonAddCommentary();
    }
  }

  async function getPlace(){
    try {
      const response = await api.get(`/places/one/${router.query.id}`);
      setLoading(false);
      setPlace(response.data);
    } catch {}
  }

  useEffect(() => {
    getPlace();
  }, [router]);

  function useButtonStar() {
    setStarButton(!starButton);
}

  return (
    <div>
      <Header/>
      <Sidebar/>

      <div className={divGeneral}>  
        {loading ? (
          <Spinner/>
        ) : (
          <div key={place.id} className='flex space-x-10'>
            <div>
              <div className='flex items-center pt-10 justify-between'>
                <h1 className={textTitle}>{place.name}</h1>
              </div>

              <h1 className={textLocation}>{place.address?.city} - {place.address?.state}</h1>

              <div className='w-559 h-462 bg-black rounded-3xl'/>
              
              <HStack>
                <i className="ri-map-pin-line"/>
                <b className='px-2 text-2xl'>Endereço</b>
                <h1 className='text-2xl'>
                  {place.address?.street}
                </h1>
              </HStack>
             
            </div>

            <div>  
              <div className={divStyleTitle}>
                <h1 className='text-3xl text-textTitle font-semibold'>Comentários</h1>
                <Button 
                  bg='bg-textTitle' 
                  rounded='rounded-full' 
                  w='w-44' 
                  h='h-10' 
                  textColor='text-white' 
                  textWeight='font-semibold'
                  onClick={handleButtonAddCommentary}
                >
                    Adicionar comentário
                </Button>
              </div>   

              <div className={divCommentary}>
                <div className={line}>
                  <Commentary place={place}/>  
                </div>
              </div>
              
            </div>
          </div>
        )}

          <Modal 
              isOpen={commentaryStates.openAddModal} 
              onClose={handleButtonAddCommentary} 
              title='Adicionar Comentário'
              footer={
                  <Button 
                      bg='bg-textTitle' 
                      rounded='rounded' 
                      w='w-full' 
                      h='h-12' 
                      textColor='text-white' 
                      textWeight='font-bold'
                      onClick={handleAddCommentary}
                  >
                      Salvar
                  </Button>
              }
          >
              <div className='flex flex-col'>
                <TextArea 
                haslabel 
                label='Comentário' 
                placeholder='ex: Lugar bonito'                       
                top='mt-2'  
                value={commentaryStates.commentary}   
                onChange={(e) => setCommentaryStates({ ...commentaryStates, commentary: e.target.value })}                                      
              />                   
              </div>
          </Modal>
      </div>  
    </div>  
  )
}
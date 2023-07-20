
import React, { useEffect, useState } from "react";
import { ObjectId } from 'mongodb';
import Link from "next/link";
import styled from "styled-components";

type Book = {
  title: string;
  publish_year : number[];
  author_name : string
  cover_edition_key : number
  id_amazon : string[]
}


type Data = {
  docs : Book[]
}



export default function Home() {

  const [books , setBooks] = useState<Book[]>([])
  const [title , setTitle] = useState<string>("")
  const[b , setb] = useState<number>(1)

  const[max, setMax] = useState<number>(15)
  const[min, setMin] = useState<number>(0)
  const[page, setPage] = useState<number>(1)


  const[lastmax, setlastmax]= useState<number>(0)
  const[lastmin, setlastmin]= useState<number>(0)

  const[pagina, setPagina] = useState<number>(1)


  useEffect(() => {

    if(title === "") return

    const fetchData = async () => {
      const lines = await fetch(`https://openlibrary.org/search.json?title=${title}&page=${pagina}`);
      const json : Data= await lines.json();
      setBooks(json.docs);

      
    };
    try {
      fetchData();
    } catch (e) {
      console.log(e);
    }
  }, [b, pagina])





  return (
    <>
    <h1>search</h1>
    <input type="text" onChange={(e)=> setTitle(e.target.value)}></input>
    <button onClick={()=> setb(b+1)}>buscar</button>
    <h1>books pag: {page} - pagina en la api {pagina}</h1>
    { books.length === 0  && ( <> <p>no hay resultado</p></>)}

    <button onClick={()=>{
  

          if(max >= (books.length)-1){

            if(books.length < 100) return
            
            setlastmax(max)
            setlastmin(min)
            setPagina(pagina+1)
            setPage(page+1)
            setMax(15)
            setMin(0)
            return
          }
           setMin(min+16)
           setMax(max+16)
           setPage(page+1)
        }}>siguiente</button>
        <button onClick={()=>{

          if(min === 0) {
            if(pagina !== 1){
            setPagina(pagina-1)
            setPage(page-1)
            setMax(lastmax)
            setMin(lastmin)
            }
            return
          }
          setMin(min-16)
          setMax(max-16)
          setPage(page-1)
        }}>anterior</button>
    <br></br>
    <br></br>

    <StyledContent>
    {books.map((e, index)=> {

      if( index >= min && index <= max ) {  

      return (
        <>
        <div>
        <img src={`https://covers.openlibrary.org/b/olid/${e.cover_edition_key}-L.jpg`} width="200" height="300"/> 
        <li>{e.title}</li>
        <li>{e?.publish_year?.map((e)=> {return (<>{e}--</>)})}</li>
        <li>{e.author_name}</li>
        {e?.id_amazon?.length > 0 && (<> <Link href={`https://www.amazon.es/dp/${e.id_amazon?.at(1)}`}> <button>ir a amazon</button> </Link></>)}
        </div>
        </>
      )
      }
    })}
    </StyledContent>
    </>
  )
}

const StyledContent = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
`;

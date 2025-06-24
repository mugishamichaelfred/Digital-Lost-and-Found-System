import { useState } from "react";
import {
  Trash2,
  Send,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Menu,
} from "lucide-react";
import { mycontext } from "../Context/ContextProvider";
import ReactPaginate from "react-paginate";

// Sample data for messages
export default function UserMessage() {

    const [pageNumber,setPagenumber] =useState(0);

  const {contact}= mycontext();
  let i=0;

  const userspage=5;
  const pageviseted= pageNumber*userspage;
  const diplaycontact= contact
  ?.slice(pageviseted,pageviseted+userspage)
  
  
  const changepage= ({selected})=>{
      setPagenumber(selected);
       };


  return (
    <div className='data-table'>

<table className="calendartable">
      <thead>
        <tr className='calendartda'>
          <td>id</td>
          <td>Name</td>
          <td>Email</td>
          <td>PhoneNumber</td>
          <td>Message</td>
          
        </tr>
      </thead>
      <tbody>
        {diplaycontact?.map((item, index) => (
          <tr key={index}>
              <td> {(i+=1)}</td>
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td>{item.subject}</td>
            <td>{item.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <ReactPaginate
    pageCount={Math.ceil(contact?.length  / userspage)}
    previousLabel={"Prev"}
    nextLabel={"Next"}
    onPageChange={changepage}
    containerClassName='pagination'
    previousLinkClassName='prevBtn'
    nextLinkClassName='next'
    disabledClassName='disabled'
    activeClassName='paginationactve'
    >

    </ReactPaginate>
    </div>
  )
}





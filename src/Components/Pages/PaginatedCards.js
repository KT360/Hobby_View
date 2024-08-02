import  {useState } from "react";
import DocumentCard from "../Applications/DocumentCard";
import { Button } from "@chakra-ui/react";
import "./PaginatedCards.css"
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";


export default function PaginatedCards ({ cards, onViewOpen }) {

    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 4;
  
    //Set page numbers
    const handleNext = () => {
      if ((currentPage + 1) * cardsPerPage < cards.length) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    const handlePrevious = () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    };
  
    //Set start and end index for list of cards
    const start = currentPage * cardsPerPage;
    const end = start + cardsPerPage;

    //Slice at where appropriate
    const currentCards = cards.slice(start, end);
  
    return (
      <div className="container">
        <div className="cards-wrapper">
          {currentCards.map(config => (
            <DocumentCard key={config.id} onOpen={onViewOpen} {...config}></DocumentCard>//It's important that the key here is FireStore document ID, React seems to confuse post data between page if not set
          ))}
        </div>

        {cards.length > 4 ? 
            <div className="navigation">
                <Button leftIcon={<ArrowBackIcon/>} onClick={handlePrevious} disabled={currentPage === 0} />

                <Button leftIcon={<ArrowForwardIcon/>} onClick={handleNext} disabled={end >= cards.length} />
            </div>
          :
          null
        }
        
      </div>
    );
  };
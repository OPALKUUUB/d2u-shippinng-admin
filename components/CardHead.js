function CardHead({ name, description }) {
   return (
      <div className="card-head">
         <h3>{name}</h3>
         <p>*{description}</p>
         <style jsx>
            {`
               .card-head {
                  width: 100%;
                  background: white;
                  box-shadow: 4px 0px 10px rgba(0, 0, 0, 0.1) inset;
                  padding-top: 10px;
                  padding-left: 25px;
                  padding-bottom: 10px;
               }
               .card-head h3 {
                  padding-top: 10px;
               }
               .card-head p {
                  margin: 10px 0;
                  font-size: 0.75rem;
                  color: gray;
               }
            `}
         </style>
      </div>
   )
}

export default CardHead

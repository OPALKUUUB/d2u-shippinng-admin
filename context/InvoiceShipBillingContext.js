export const InvoiceShipBillingContext = React.createContext()

export const useInvoiceShipBillingContext = React.useContext(InvoiceShipBillingContext)

export const InvoiceShipBillingProvider = ({children}) => {
    const [state, setState] = React.useState({
        test: []
    })
    return (
        <InvoiceShipBillingContext.Provider value={state}>
            {children}
        </InvoiceShipBillingContext.Provider>
    );
}
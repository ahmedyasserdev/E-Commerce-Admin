'use client'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Copy, Server } from 'lucide-react';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

type ApiAlertProps = {
    title : string ;
    description : string ;
    variant : "public" | "admin"
}


const textMap : Record<ApiAlertProps['variant'] , string >  =  {
    public : "Public",
    admin : "Admin"
}
const variantMap : Record<ApiAlertProps['variant'] , BadgeProps['variant'] >  =  {
    public : "secondary",
    admin : "destructive"
}

const ApiAlert = ({title , description , variant = "public" } : ApiAlertProps) => {
    const onCopy = () => {
        navigator.clipboard.writeText(description);
        toast.success("Api Route copied to the clipboard.")
    }
  return (
    <Alert>
        <Server  className = "size-4" />
    
        <AlertTitle className  = "flex items-center gap-x-2 " >
            {title}
            <Badge variant = {variantMap[variant]} >{textMap[variant]}</Badge>
        </AlertTitle>

        <AlertDescription className='flex-between' >
            <code className = "relative rounded-md bg-muted px-[0.3rem] py-[0.2rem] p-semibold-14 font-mono " >
            {description}
            </code>

            <Button variant = "outline" size = "icon" onClick={onCopy}>
                <Copy className = 'size-4' />
            </Button>
        </AlertDescription>

    </Alert>
  )
}

export default ApiAlert
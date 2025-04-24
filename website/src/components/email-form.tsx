import React from 'react';
import { Input, Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';

interface EmailFormProps {
  buttonText: string;
  onSubmit: (email: string) => void;
  className?: string;
}

const EmailForm: React.FC<EmailFormProps> = ({ buttonText, onSubmit, className = '' }) => {
  const [email, setEmail] = React.useState('');
  const [isValid, setIsValid] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsValid(validateEmail(value));
  };
  
  const handleSubmit = () => {
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(email);
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onValueChange={handleEmailChange}
        className="flex-grow"
        classNames={{
          inputWrapper: "bg-content1 border-electric-blue"
        }}
        startContent={
          <Icon icon="lucide:mail" className="text-default-400" />
        }
        endContent={
          isValid && (
            <Tooltip content="Email is valid">
              <div className="flex items-center">
                <Icon icon="lucide:check" className="text-success" />
              </div>
            </Tooltip>
          )
        }
      />
      
      <Button
        color="secondary"
        onPress={handleSubmit}
        isDisabled={!isValid}
        isLoading={isSubmitting}
        className="font-montserrat font-medium"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default EmailForm;
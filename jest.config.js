
module.exports = {
 
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], 

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['@swc/jest', {
      jsc: {
        parser: {
          syntax: 'typescript', 
          tsx: true,            
          decorators: true,     
        },
        transform: {
          react: {
            runtime: 'automatic', 
          },
        },
      },
    }],
  },

  
  moduleNameMapper: {
   
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

  
    '^@/(.*)$': '<rootDir>/$1',

  },

};
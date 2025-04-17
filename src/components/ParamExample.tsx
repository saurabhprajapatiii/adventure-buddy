
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ParamExample = () => {
  // useParams hook extracts parameters from the URL
  const params = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>URL Parameter Example</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Current URL Parameters:</h3>
            
            {Object.keys(params).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(params).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-2 border-b pb-2">
                    <span className="font-medium">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No parameters found in the URL</p>
            )}
            
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">How to use URL parameters:</h4>
              <p className="text-sm text-muted-foreground">
                Try navigating to <code>/params/hello</code> or <code>/params/hello/world</code> to see the parameters.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParamExample;

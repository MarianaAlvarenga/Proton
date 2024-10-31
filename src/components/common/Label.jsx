import React from "react";

const Label  = ({labelContent='example'}) => {
    return(
      <div class="field" style={{margin:'1em'}}>
        <div class="control">
          <input class="input" type="email" placeholder={labelContent} />
        </div>
      </div>
    );
};

export default Label;
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import TrainingBulletinTable from "../../components/app/trainingbulletin/TrainingBulletinTable";
import CreateTrainingbulletin from "../../components/app/trainingbulletin/CreateTrainingbulletin";

const Trainingbulletin = () => {
  const [createTrainingbulletin, setCreateTrainingbulletin] = useState(false);
  return (
    <div className="w-full h-auto">
      {createTrainingbulletin ? (
        <CreateTrainingbulletin
          setCreateTrainingbulletin={setCreateTrainingbulletin}
          handleback={() => setCreateTrainingbulletin(false)}
        />
      ) : (
        <div>
          <div className="flex px-1 justify-between items-center mb-4">
            <h3 className="text-[24px] font-bold text-black">
              Training & Bulletin
            </h3>

            <button
              onClick={() => setCreateTrainingbulletin(true)}
              className="flex items-center gap-2 px-5 h-[40px] rounded-full bg border-red-500 text-white shadow-md  font-medium text-[16px] border  hover:opacity-90 transition-all duration-300"
            >
              <FiPlus size={20} />
              <span className="pt-1">Create Training & Bulletin</span>
            </button>
          </div>
          <TrainingBulletinTable />
        </div>
      )}
    </div>
  );
};

export default Trainingbulletin;

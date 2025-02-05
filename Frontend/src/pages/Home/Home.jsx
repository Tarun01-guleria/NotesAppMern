import { MdAdd } from "react-icons/md";
import NoteCard from "../../components/Cards/NoteCard";
import NavBar from "../../components/NavBar";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import AddEditNotes from "./AddEditNotes";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import EmptyCard from "../../components/EmptyCard/EmptyCard";

const Home = () => {
  const { currentUser, loading, errorDispatch } = useSelector(
    (state) => state.user
  );

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);

  const navigate = useNavigate();
  const [openAddEditModal, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  useEffect(() => {
    if (currentUser === null || !currentUser) {
      navigate("/login");
    } else {
      setUserInfo(currentUser.user.username);
      getAllNotes();
    }
  }, [currentUser, navigate]);

  // get all notes

  const getAllNotes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/note/all", {
        withCredentials: true,
      });

      if (res.data.success === false) {
        console.log(res.data);
        return;
      }
      console.log(res.data);

      setAllNotes(res.data.notes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (noteDetails) => {
    setOpenAddEditModel({ isShown: true, data: noteDetails, type: "edit" });
  };

  //Delete Note

  const deleteNote = async (data) => {
    const noteId = data._id;

    try {
      const res = await axios.delete(
        "http://localhost:8000/api/note/delete/" + noteId,
        { withCredentials: true }
      );
      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      getAllNotes();
    } catch (error) {
      toast(error.message);
    }
  };

  const onSearchNote = async (query) => {
    try {
      const res = await axios.get("http://localhost:8000/api/note/search", {
        params: { query },
        withCredentials: true,
      });

      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }

      setAllNotes(res.data.notes);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClearSearch = () => {
    getAllNotes();
  };
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;

    try {
      const res = await axios.put(
        `http://localhost:8000/api/note/update-note-pinned/${noteId}`,
        { isPinned: !noteData.isPinned },
        { withCredentials: true }
      );

      if (res.data.success === false) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <>
      <NavBar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mt-8 max-md:m-5">
            {allNotes.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={note.createdAt}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={() => {
                  handleEdit(note);
                }}
                onDelete={() => {
                  deleteNote(note);
                }}
                onPinNote={() => {
                  updateIsPinned(note);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={
              "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw0NDQ0NDQ0NDQ4NDQ0NDQ0NDQ8NDQ0NFREWFhURFRUYHTQgGBonHRUVIjEhJTUrLi4uFx8zODMsNygtLisBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIANwA5QMBIgACEQEDEQH/xAAbAAEBAAMBAQEAAAAAAAAAAAAABgMFBwIEAf/EAEcQAAICAQICBgUHCAYLAAAAAAABAgMEBREGEgcTITFBURRhcZGhIjJCUnKBsRcjJDM0gpKiFlRig7LBFSU1RFNjdJOz0fH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A7iAAAAAAAAD8AH6DxZZGC3lKMV5yaiviabN4v0jHbjdqeDXJd8HlVc6/dT3A3gIu3pS0JTddWXPJsX0MXFyb2/Y1DZ+88flCla+XF0PXMju2nLDWPS/3pyAtwRH9IOI7W1Tw9XRHwszNSpXvhWmwqeLbvnX6LhxfhXVkZVkf4tkBbgiFwprVv7TxJkrfvjh4ePjJeyXawujXFn+16hrGbv3rI1G1Rf3Q2ArsvUMehb3X00pd7tthWl72aLL6QNCp3c9Vwnt39XdG5+6G58+H0aaBT83TKJvzvc8hv287e5vcLQsDHSVGFiUpd3VY9Ve3uQEzHpR0u1b4sNQzV27ei6dkzTfkt4oQ421C5b4vDeqy37vS3RhfCcty2AEStS4quX5vS9Mw9/61nTyGv+1EPSuKLtus1fT8Tz9E0+Vz+52yLYARMuBsy7b0riPV5+axp1YSfq+REnekPgbFwdLvz6bM2/Jw54+RXZlZt9+3LdDm+S3t3b+B1g0fHGH6RpGpUrvnhZKj9pVtr4pAbLScv0jGov7E7a4TaXcm127H1kt0YZfX6Jp832vqIxl7UVIAAAAAABH8R8bvFy54GHp+RqOXXTC6yNc6qaKlPflVlkn8lvbfu7mae3O4ny997dO0mtpbKqEs7KT9bltADo+5p9U4r0vDe2TqGJTJdvJK+HWbfYT3IifBryf9oanqefv86ueS8eh/3dexs9M4Q0zG2dGDjQa+m6lOf8Ut2Bkt6U9Ml+xVajqT32/QsG6Ud/tTUVsYZcY63e9sTQHVFr9bn5tVW3trjvIoKqElskkvJLZH0QpAlN+Kr9+fM0rBT7ljY1uVNL1uxpbn5/RDOvS9M4g1W360ceVWFB+raC3LOFJnhSBE1dGWkOSndRdlz+vl5V97fractjd4HBulUPenTsKD+ssety97W5QqCR6Aw0Y0K1tCMYLyjFRXwMwAAAAAAAAAAAAAAAPF9anCcH3TjKL9jWx7AHPuhCclpDx5veeLlZFMv3ZtL8DoRzrovToz+IsNv5mqXXQXlXY+Zf4jooAAAAABzDghO+zV8+WzlmarkqL27VRS+rrj69kmVkaiY6IY8+iYs33zty5y+08izct4UgfNCkzwpPqhSZo17AfNCkzxqMqR+geVFI9AAAAAAAAAAAAAAAAAAAAAAAHO9CTo4u1it/Ny8XDyIL2VKMn74M6Kc51xdRxhpt2+0cvTbMdrznC2T3900dGAAAAAAIPoho5dIhV40ZmfTL1Sjkz/APaLiNaRGdG6dV2v4jf6nWsm2C+rXfGNkV8WWwAAAAAAAAAAAAAAAAAAAAAAAAAAAAABzvpPXU6jw5md3V5t2PJ+asgml74HRSA6aav9WUZHjh6jhX7+Sc+R/wCMucOznqqn9euEvfFMDMAAAAAiOH11PEuuU9yysXTs2K83GMqpP3pFsROcup4rwp9yzdIysf7U6bY2fBNlsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASnSpidfoOpx235MaVy9XVNWb/AMps+DctX6Zg2p78+PW/hsfVrmKsjDy6Gt1djX1befNW1t8SX6GstXaDhbPfq4ur+F7bAW4AAAACI465atV4ayn2cuffib/9RQ4qP3uKLYieltRhp+LlS2XoOq6blcz+jtcot+6ZbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA530MtV0alhrs9D1PLpUV9FK2XZ+B0Q53wNtRxDxHirsUr6srbzdtcZt+9sDooAAAACV6UsRX6DqkGt+XEnd99TVif8hvNEy/SMPFvT367Got38+aCf8AmetZxFkYmVjtbq/Hupa81ODj/maDosy+v0HS5b78uLGl+rqm69v5QKoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOefs/GT8Fn6XXN/2p1ylD8FE6Gc96QV6NrPDmdvtF5N2Da/BqxJwXvUgOhgAAAABEdE/5vCzMTu9B1bUcbl8o9bzr/GW5EcEvqtX4lxe79MxcyK81fR2v3xAtgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiOmPElZot11a3twbsfNr9TrsXM/4XItz5dTwoZWPfjWdsMimymfj8mcXF/iBkwcmN9NV0HvG6qu2LXjGUU1+JnI/onzJ2aNjVW7K7Blbp90U9+WdE3BL+FRLAAAABEYr6ni3KhttHM0Wm7fwdlN/Jt7pFuRHEjdPEmgXJdmRTqeHY/DsrjbBe+LAtgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQ3Dn6BxDq2A9lVqNder4y22XWfq8hetuSTLohekyLxHp2twT30vKisnlTblgX7V3di79t4suITUkpRaakk012pp9zQHoAACI6S26rNBy0t+o1zFrm/q1XRnXJ/Fe8tyL6YIyWh5N0FzTxbcTKgvXXkVtv3bgWYPFNinCM13TjGS9jW57AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPl1TAqy8e/FuXNVkVWU2LfZ8k4uL2fg+3vJfow1C14lumZUt8zR7ng3eDspX6i32OG3b6iyILjPfSdSxNehusaxR0/V0u5UTklTkNb/Rnsm+/ZpAXwPyMk0mmmmk009015gD9NHxxiPI0jU6V3zwcpR+11cmvikbw8XQU4yg+6UZRfsa2A03BGZ6RpOm3PvswsZy+11aT+KZuyM6IbH/oTGqk/lY1mViy811d80t/u2LMAAAAAAAAAAAAAAAAAAAAAAAAAAAABhysmuiud11kKqq4udllklCEIrvbb7EgMxzfijW3rmXLh/T7VGhtw1XPSUoxgu2WLTv2Sse3a/D37aziLjLJ1nnxdLlZi6d2wv1HlcLspfShQn2xj4cz/APvnRqK8FUxxoKuNLUoRXi14t+LfiwOrafh141FOPUmq6K4VVqUnOShGKS3b7X2LvYPWJkRurhbD5s4qS+/wAGYAARHRsuqt17F/4Gt5NkV5QujGxfiy2Inh2PU8S69Vu9srG03MS8N4xnXJr3ItgAAAAAAAAAAAAAAAAAAAAAAAY8jIrqg7LZwqhFbynZJQhFebb7EBkBCat0pYEJSp06u7Vr12bYkdsaEtt1z3y+Sl61uSmp5msarus7K9Cxn/ALjp8nFyj5W3d8vYuwC14n6Q8LCm8bHUtRzu3bExWpcj/wCbZ82tfH1EHqFObq1kbtYtjKuD5qdNx3JYdT37HPxsl636/A+vStKpx4qnFojBP6NcW5Sfm33yftN/icOZluz6rq0/pWvk+Hf8ANRGKSSSSSSSSWySXgj9Xb2Ltb7ku9ljh8HQWzvtlP8As1rkj7+/8DfYem49H6qqEH9bbeb/AHn2gaPhb0ummUJ483DmUq+aUa2t/ndku3bu97P0pgAAAERlwVPFuJZ/XNFycfbwcqr42b+3ZlsRPG8eq1jhrK7uXMy8R9uyfX47ST++BbAAAAAAAAAADFdkV1reyyEF5zkor4gZQaHN400fH3Vup4MWvorJrnL3Re5prulfQk2qsm3JkuzbHxMmzt8k+XZ+8C3Bzz8qkLG1jaPq9z8HZTXRGXs3lueYcY8Q5Dfo/DqqX0Z5OZun7VCPYB0UHO+q4zyk1K7TNOT7nTU75pevnb7fuH5PNQye3UNfz7t/nQpsdFT9XLDYCz1TXsHDW+XmY2P6rroQk/Ym92SeZ0saZvy4VWbqUt3H9FxpqpNedlmy29a3M2m9FejY7UnQ7p7789z55N+e8u0p8XQ8OpJQx6lt3bx5vxA53dxXxJnvlxcXG02D37Zc2flbeDSj8hfefPHo9zM2cbdRsyc+afMnm3KNMHt9GmL2XuOtxiorZJJeSWyPQEXp/Ayrioysrqgu6uivZJeru/A3WLwxh198JWvzsk2vcuw3QAxUY9da2rhCC8oRUV8DKAAAAAAAAABEdLUeXCwsrtXoWsablbp7dnWdW/8AyFq2l2tpLzfYjWcUaJTqeFdhZDsjVf1alKpxjZFxsjNOLaaT3ivA5/Lo7wbci2nIv1HJjCSiuvzbbG1su/wA6Fm8Qafj79fnYlO3f1mRVB+5s0WZ0naBS9nqNVkvCNELchv2ckWY8Hov0OpJrChN9/5zaT9+xvcXhnTqVtXh0R2/sJ/iBK39LOBulj4Wq5e/dKrDcIfe7JIwy6QdVtaWHw5kzT+nkZVdW37sYts6DVi1Q+ZXXH7MIozAc5lqvGF7XVYGmYsX3u6V9s17O1IPROLb3+d1mjGj4xx8SpP+J7s6MAOc/k4zbnvma/qdvnGF8q4e6Oxko6INI35r+vyZfWtunN/zNnQgBL4XR9o1HzMGnfzcVv8AA3NGjYlfzMamP93F/ifeAPEK4x7IxjH2JI9gAAAAAAAAAAAAAAAAAAAB/9k="
            }
            message={`Ready to capture your ideas? Click the 'Add' button to start noting down your thoughts, inspiration and reminders. Let's get started!`}
          />
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#2B85FF] hover:bg-blue-600 absolute right-10 bottom-10 cursor-pointer "
        onClick={() => {
          setOpenAddEditModel({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-wd:w-[60%] max-sm:w-[70%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll "
      >
        <AddEditNotes
          onClose={() =>
            setOpenAddEditModel({ isShown: false, type: "add", data: null })
          }
          noteData={openAddEditModal.data}
          type={openAddEditModal.type}
          getAllNotes={getAllNotes}
        />
      </Modal>
    </>
  );
};

export default Home;

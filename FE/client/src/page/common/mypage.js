import { Breadcrumb, Row, Col, message, Select } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style/mypage.css";

const { Option } = Select;

const Mypage = ({ type }) => {
  const [user, setUser] = useState({});
  const [issuers, setIssuers] = useState([]);
  const [pageTitle, setPageTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios({
      url: "http://localhost:9999/api/v1/auth/accesstoken",
      method: "GET",
      withCredentials: true,
    })
      .then((data) => {
        axios({
          url: "http://localhost:9999/api/v1/user/issuers",
          method: "GET",
          withCredentials: true,
        }).then((result) => {
          return setIssuers([...result.data]);
        });
        data.data.type === "holder"
          ? setPageTitle(data.data.user.username)
          : setPageTitle(data.data.user.title);
        setUser({
          ...data.data.user,
          password: "",
        });
      })
      .catch(() => {});
  }, []);

  const onchange = (e) => {
    setUser((prevUser) => {
      return {
        ...prevUser,
        [e.target.id]: e.target.value,
      };
    });
  };

  const issuerListChange = (e) => {
    setUser((prev) => {
      return {
        ...prev,
        IssuerList: e,
      };
    });
  };

  const updateInfo = (e) => {
    const userNameRegex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|]+$/;
    const userTitleRegex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|[0-9]]+$/;
    if (type === "holder") {
      if (user.IssuerList.length < 1) {
        message.error("소속기관을 최소 1개이상 선택해주세요.");
      } else if (!userNameRegex.test(user.username)) {
        message.error("이름은 한글, 영어로만 입력해주세요.");
      } else if (user.username.length < 1 || user.username.length > 10) {
        message.error("이름은 1글자이상 10글자 이하로 해주세요.");
      } else {
        axios({
          url: `http://localhost:9999/api/v1/user/holder/${user._id}`,
          method: "PUT",
          data: {
            username: user.username,
            IssuerList: user.IssuerList,
          },
          withCredentials: true,
        }).then(() => {
          message.success("정보 수정 완료!");
          navigate("/home");
          navigate(0);
        });
      }
    } else {
      if (!userTitleRegex.test(user.title)) {
        message.error("기관명은 한글, 영어, 숫자로만 입력해주세요.");
      } else if (user.title.length < 1 || user.title.length > 20) {
        message.error("기관명은 1글자이상 20글자 이하로 해주세요.");
      } else {
        axios({
          url: `http://localhost:9999/api/v1/user/${type}/${user._id}`,
          method: "PUT",
          data: {
            title: user.title,
          },
          withCredentials: true,
        }).then(() => {
          message.success("정보 수정 완료!");
          navigate("/home");
          navigate(0);
        });
      }
    }
  };
  useEffect(() => {});
  const emailDOM = (
    <>
      <div className="mypage--DOM--title">이메일</div>
      <input
        className="mypage--input disabled"
        type="text"
        id="email"
        onChange={onchange}
        value={user.email}
        disabled
      />
    </>
  );
  const titleDOM = (
    <>
      <div className="mypage--DOM--title">기관명</div>
      <input
        className="mypage--input"
        type="text"
        id="title"
        onChange={onchange}
        value={user.title}
      />
      <div className="validate--label">
        기관명은 1글자 이상 20글자 미만의 영어, 한글, 숫자만 입력가능합니다.
      </div>
    </>
  );
  const nameDOM = (
    <>
      <div className="mypage--DOM--title">이름</div>
      <input
        className="mypage--input"
        type="text"
        id="username"
        onChange={onchange}
        value={user.username}
      />
      <div className="validate--label">
        이름은 1글자 이상 10글자 미만의 영어, 한글만 입력가능합니다.
      </div>
    </>
  );
  const descriptionDOM = (
    <>
      <div className="mypage--DOM--title">기관 소개</div>
      <input
        className="mypage--input disabled"
        type="text"
        id="description"
        onChange={onchange}
        value={user.desc}
        disabled
      />
    </>
  );

  /*
  const requiredVCDOM = (
    <>
      <div className="mypage--DOM--title">필수 요구사항</div>
      <input
        className="mypage--input disabled"
        type="text"
        id="requiredVC"
        onChange={onchange}
        value={user.walletAddress}
        disabled
      />
    </>
  );
  */

  // 수정
  const walletAddressDOM = (
    <>
      <div className="mypage--DOM--title">지갑 주소</div>
      <input
        className="mypage--input disabled"
        type="text"
        id="walletAddress"
        onChange={onchange}
        value={user.walletAddress}
        disabled
      />
    </>
  );

  /*
  const passwordDOM = (
    <>
      <div>비밀번호</div>
      <input
        className="mypage--input"
        type="password"
        id="password"
        onChange={onchange}
        value={user.password}
      />
    </>
  );
  */

  const issuerListDOM = (
    <>
      <div className="mypage--DOM--title">내가 소속된 기관</div>
      <Select
        style={{ width: "100%", borderRadius: "5px" }}
        mode="tags"
        defaultValue={user.IssuerList}
        onChange={issuerListChange}
        value={user.IssuerList}
      >
        {issuers.map((e, idx) => {
          return <Option key={e._id}>{e.title}</Option>;
        })}
      </Select>
    </>
  );

  const holderDOM = [nameDOM, emailDOM, walletAddressDOM, issuerListDOM];
  const issuerDOM = [titleDOM, emailDOM, descriptionDOM];
  const verifierDOM = [titleDOM, emailDOM];

  return (
    <div className="mypage">
      <Breadcrumb className="mypage--breadcrumb" separator=">">
        <Breadcrumb.Item href="/">홈</Breadcrumb.Item>
        <Breadcrumb.Item href="/mypage">정보 수정</Breadcrumb.Item>
      </Breadcrumb>
      <div className="mypage--description">{type}의 정보를 수정합니다.</div>

      <div className="mypage--form">
        <Row className="mypage--row">
          <Col span={20} offset={2}>
            <Row>
              <Col span={12} offset={6}>
                <div className="mypage--title">
                  {pageTitle}
                  정보 수정
                </div>
                <hr />
                {type === ""
                  ? ""
                  : type === "holder"
                  ? holderDOM.map((e, idx) => {
                      return (
                        <Row className="mypage--row" key={idx}>
                          {e}
                        </Row>
                      );
                    })
                  : type === "issuer"
                  ? issuerDOM.map((e, idx) => {
                      return (
                        <Row className="mypage--row" key={idx}>
                          {e}
                        </Row>
                      );
                    })
                  : type === "verifier"
                  ? verifierDOM.map((e, idx) => {
                      return (
                        <Row className="mypage--row" key={idx}>
                          {e}
                        </Row>
                      );
                    })
                  : ""}
                <hr style={{ margin: "30px 0 " }} />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={6} offset={9}>
            <button className="mypage--submit" onClick={updateInfo}>
              정보 수정
            </button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Mypage;

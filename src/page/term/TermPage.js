import React, { useEffect, useContext } from 'react';

import SoundContext from "../../context/SoundContext.js";
import ThemeContext from "../../context/ThemeContext.js";

import style from './TermPageStyle.module.css';
import colorStyle from '../../style/Color.module.css';

import homeBackgroundMusic from '../../sound/home_background_music.mp3';

function TermPage({ about }) {

    let content = null;

    // context
    const { currentMusic, setCurrentMusic, setCurrentMusicVolume } = useContext(SoundContext);
    const { theme } = useContext(ThemeContext);

    // state

    // 페이지 마운트 시, 실행
    useEffect(() => {

        // 배경음악 변경
        if (currentMusic !== homeBackgroundMusic) {
            setCurrentMusic(homeBackgroundMusic);
            setCurrentMusicVolume(1);
        }

        // 스크롤을 최상단으로 위치
        window.scrollTo(0, 0);

    }, []);

    if(about === "SERVICE") {
        content = <p id={style["text-term"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
            <b>제1조(목적)</b><br />
            1. 본 약관은 'Speed.you'가 제공하는 서비스(이하 '서비스'라 합니다)를 이용함에 있어 당사자의 권리 의무 및 책임사항을 규정하는 것을 목적으로 합니다.<br />
            <br /><b>제2조(정의)</b><br />
            1. '회사'라 함은, 'Speed.you'가 재화 또는 용역을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화등을 거래할 수 있도록 설정한 가상의 영업장을 운영하는 사업자를 말합니다.<br />
            2. '이용자'라 함은, '사이트'에 접속하여 본 약관에 따라 '회사'가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.<br />
            3. '회원'이라 함은, '회사'에 개인정보를 제공하고 회원으로 등록한 자로서, '회사'의 서비스를 계속하여 이용할 수 있는 자를 말합니다.<br />
            4. '비회원'이라 함은, 회원으로 등록하지 않고, '회사'가 제공하는 서비스를 이용하는 자를 말합니다.<br />
            <br /><b>제3조(약관 외 준칙)</b><br />
            본 약관에서 정하지 아니한 사항은 법령 또는 회사가 정한 서비스의 개별 약관, 운영정책 및 규칙(이하 '세부지침'이라 합니다)의 규정에 따릅니다. 또한 본 약관과 세부지침이 충돌할 경우에는 세부지침이 우선합니다.<br />
            <br /><b>제4조(약관의 명시 및 개정)</b><br />
            1. '회사'는 이 약관의 내용과 상호, 소재지, 전자우편주소 등을 이용자가 쉽게 알 수 있도록 '회사' 홈페이지의 초기 서비스화면에 게시합니다. 다만 본 약관의 내용은 '이용자'가 연결화면을 통하여 확인할 수 있도록 할 수 있습니다.<br />
            2. '회사'는 '전자상거래 등에서의 소비자보호에 관한 법률', '약관의 규제에 관한 법률','전자거래기본법', '정보통신망 이용촉진등에 관한 법률', '소비자보호법' 등 관련법령(이하 '관계법령'이라 합니다)에 위배되지 않는 범위내에서 본 약관을 개정할 수 있습니다.<br />
            3. '회사'가 본 약관을 개정하고자 할 경우, 적용일자 및 개정사유를 명시하여 현행약관과 함께 온라인 쇼핑몰의 초기화면에 그 적용일자 7일전부터 적용일자 전날까지 공지합니다. 다만, '이용자'에게 불리한 내용으로 약관을 변경하는 경우 최소 30일 이상 유예기간을 두고 공지합니다.<br />
            4. '회사'가 본 약관을 개정한 경우, 개정약관은 적용일자 이후 체결되는 계약에만 적용되며 적용일자 이전 체결된 계약에 대해서는 개정 전 약관이 적용됩니다. 다만, 이미 계약을 체결한 '이용자'가 개정약관의 내용을 적용받고자 하는 뜻을 '회사'에 전달하고 '회사'가 여기에 동의한 경우 개정약관을 적용합니다.<br />
            5. 본 약관에서 정하지 아니한 사항 및 본 약관의 해석에 관하여는 관계법령 및 건전한 상관례에 따릅니다.<br />
            <br /><b>제5조(제공하는 서비스)</b><br />
            '회사'는 다음의 서비스를 제공합니다.<br />
            1. 반응속도 테스트 서비스<br />
            2. 테스트 결과 기록 제공<br />
            3. 모든 사용자의 테스트 결과 랭킹<br />
            4. 기타 '회사'가 정하는 업무<br />
            <br /><b>제6조(서비스의 중단 등)</b><br />
            1. '회사'가 제공하는 서비스는 연중무휴, 1일 24시간 제공을 원칙으로 합니다. 다만 '회사' 시스템의 유지 · 보수를 위한 점검, 통신장비의 교체 등 특별한 사유가 있는 경우 서비스의 전부 또는 일부에 대하여 일시적인 제공 중단이 발생할 수 있습니다.<br />
            2. '회사'는 전시, 사변, 천재지변 또는 이에 준하는 국가비상사태가 발생하거나 발생할 우려가 있는 경우, 전기통신사업법에 의한 기간통신사업자가 전기통신서비스를 중지하는 등 부득이한 사유가 발생한 경우 서비스의 전부 또는 일부를 제한하거나 중지할 수 있습니다.<br />
            3. '회사'가 서비스를 정지하거나 이용을 제한하는 경우 그 사유 및 기간, 복구 예정 일시 등을 지체 없이 '이용자'에게 알립니다.<br />
            <br /><b>제7조(회원가입)</b><br />
            1. '회사'가 정한 양식에 따라 '이용자'가 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.<br />
            2. '회사'는 전항에 따라 회원가입을 신청한 '이용자' 중 다음 각호의 사유가 없는 한 '회원'으로 등록합니다.<br />
            &emsp;1. 가입신청자가 본 약관에 따라 회원자격을 상실한 적이 있는 경우. 다만, '회사'의 재가입 승낙을 얻은 경우에는 예외로 합니다.<br />
            &emsp;2. 회원정보에 허위, 기재누락, 오기 등 불완전한 부분이 있는 경우<br />
            &emsp;3. 기타 회원으로 등록하는 것이 '회사'의 운영에 현저한 지장을 초래하는 것으로 인정되는 경우<br />
            3. 회원가입 시기는 '회사'의 가입승낙 안내가 '회원'에게 도달한 시점으로 합니다.<br />
            <br /><b>제8조(회원탈퇴 및 자격상실 등)</b><br />
            1. '회원'은 '회사'에 언제든지 탈퇴를 요청할 수 있으며, '회사'는 지체없이 회원탈퇴 요청을 처리합니다. 다만 이미 체결된 거래계약을 이행할 필요가 있는 경우에는 본약관이 계속 적용됩니다.<br />
            <br /><b>제9조(회원에 대한 통지)</b><br />
            1. '회사'는 '회원' 회원가입 시 기재한 이메일을 이용하여 '회원'에게 통지 할 수 있습니다.<br />
            2. '회사'가 불특정 다수 '회원'에게 통지하고자 하는 경우 1주일 이상 '사이트'의 게시판에 게시함으로써 개별 통지에 갈음할 수 있습니다. 다만 '회원'이 서비스를 이용함에 있어 중요한 사항에 대하여는 개별 통지합니다.<br />
            <br /><b>제10조(계약의 성립)</b><br />
            1. '회사'는 다음 각호의 사유가 있는 경우 본 약관의 '구매신청' 조항에 따른 구매신청을 승낙하지 않을 수 있습니다.<br />
            &emsp;1. 신청 내용에 허위, 누락, 오기가 있는 경우<br />
            &emsp;2. 회원자격이 제한 또는 정지된 고객이 구매를 신청한 경우<br />
            &emsp;3. 재판매, 기타 부정한 방법이나 목적으로 구매를 신청하였음이 인정되는 경우<br />
            &emsp;4. 기타 구매신청을 승낙하는 것이 '회사'의 기술상 현저한 지장을 초래하는 것으로 인정되는 경우<br />
            2. '회사'의 승낙이 본 약관의 '수신확인통지' 형태로 이용자에게 도달한 시점에 계약이 성립한 것으로 봅니다.<br />
            3. '회사'가 승낙의 의사표시를 하는 경우 이용자의 구매신청에 대한 확인 및 판매가능여부, 구매신청의 정정 및 취소 등에 관한 정보가 포함되어야 합니다.<br />
            <br /><b>제11조(개인정보보호)</b><br />
            1. '회사'는 '구매자'의 정보수집시 다음의 필수사항 등 구매계약 이행에 필요한 최소한의 정보만을 수집합니다.<br />
            &emsp;1. 이메일<br />
            &emsp;2. 비밀번호<br />
            &emsp;3. 닉네임<br />
            &emsp;4. 기타 서비스에 필요한 정보<br />
            2. '회사'가 개인정보보호법 상의 고유식별정보 및 민감정보를 수집하는 때에는 반드시 대상자의 동의를 받습니다.<br />
            3. '회사'는 제공된 개인정보를 '구매자'의 동의 없이 목적외 이용, 또는 제3자 제공할 수 없으며 이에 대한 모든 책임은 '회사'가 부담합니다. 다만 다음의 경우에는 예외로 합니다.<br />
            &emsp;1. 통계작성, 학술연구 또는 시장조사를 위하여 필요한 경우로서 특정 개인을 식별할 수 없는 형태로 제공하는 경우<br />
            &emsp;2. 재화 등의 거래에 따른 대금정산을 위하여 필요한 경우<br />
            &emsp;3. 도용방지를 위하여 본인 확인이 필요한 경우<br />
            &emsp;4. 관계법령의 규정에 따른 경우<br />
            4. 본 약관에 기재된 사항 이외의 개인정보보호에 관항 사항은 '회사'의 '개인정보처리방침'에 따릅니다.<br />
            <br /><b>제12조('회사'의 의무)</b><br />
            1. '회사'는 관계법령, 본 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 약관이 정하는 바에 따라 지속적 · 안정적으로 재화 및 용역을 제공하는데 최선을 다하여야 합니다.<br />
            2. '회사'는 '이용자'가 안전하게 인터넷 서비스를 이용할 수 있도록 개인정보(신용정보 포함)보호를 위한 보안 시스템을 갖추어야 합니다.<br />
            3. '회사'가 상품에 대하여 '표시 · 광고의 공정화에 관한 법률' 제3조 소정의 부당한 표시 · 광고행위를 하여 '이용자'가 손해를 입은 때에는 이를 배상할 책임을 집니다.<br />
            4. '회사'는 '이용자'의 수신동의 없이 영리목적으로 광고성 전자우편, 휴대전화 메시지, 전화, 우편 등을 발송하지 않습니다.<br />
            <br /><b>제13조(이용자 및 회원의 의무)</b><br />
            1. '이용자'는 회원가입 신청 시 사실에 근거하여 신청서를 작성해야 합니다. 허위, 또는 타인의 정보를 등록한 경우 '회사'에 대하여 일체의 권리를 주장할 수 없으며, '회사'는 이로 인하여 발생한 손해에 대하여 책임을 부담하지 않습니다.<br />
            2. '이용자'는 본 약관에서 규정하는 사항과 기타 '회사'가 정한 제반 규정 및 공지사항을 준수하여야 합니다. 또한 '이용자'는 '회사'의 업무를 방해하는 행위 및 '회사'의 명예를 훼손하는 행위를 하여서는 안 됩니다.<br />
            3. '이용자'는 주소, 연락처, 전자우편 주소 등 회원정보가 변경된 경우 즉시 이를 수정해야 합니다. 변경된 정보를 수정하지 않거나 수정을 게을리하여 발생하는 책임은 '이용자'가 부담합니다.<br />
            4. '이용자'는 다음의 행위를 하여서는 안됩니다.<br />
            &emsp;1. '회사'에 게시된 정보의 변경<br />
            &emsp;2. '회사'가 정한 정보 외의 다른 정보의 송신 또는 게시<br />
            &emsp;3. '회사' 및 제3자의 저작권 등 지식재산권에 대한 침해<br />
            &emsp;4. '회사' 및 제3자의 명예를 훼손하거나 업무를 방해하는 행위<br />
            &emsp;5. 외설 또는 폭력적인 메시지, 화상, 음성 기타 관계법령 및 공서양속에 반하는 정보를 '회사'의 '사이트'에 공개 또는 게시하는 행위<br />
            5. '회원'은 부여된 아이디(ID)와 비밀번호를 직접 관리해야 합니다.<br />
            6. '회원'이 자신의 아이디(ID) 및 비밀번호를 도난당하거나 제3자가 사용하고 있음을 인지한 경우에는 바로 '회사'에 통보하고 안내에 따라야 합니다.<br />
            <br /><b>제14조(저작권의 귀속 및 이용)</b><br />
            1. 제공하는 서비스 및 이와 관련된 모든 지식재산권은 '회사'에 귀속됩니다.<br />
            2. '이용자'는 지식재산권이 있는 정보를 사전 승낙없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나, 제3자가 이용하게 하여서는 안됩니다.<br />
            3. '이용자'가 서비스 내에 게시한 게시물, 이용후기 등 콘텐츠(이하 '콘텐츠')의 저작권은 해당 '콘텐츠'의 저작자에게 귀속됩니다.<br />
            4. 전 항의 규정에도 불구하고 '회사'는 서비스의 운영, 전시, 전송, 배포, 홍보 등의 목적으로 별도의 허락 없이 무상으로 저작권법 및 공정한 거래관행에 합치되는 범위 내에서 다음 각호와 같이 '이용자'가 등록한 저작물을 이용할 수 있습니다.<br />
        </p>
    }
    else if(about === "PRIVACY") {
        content = <p id={style["text-term"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
            <b>제1조(목적)</b><br />
            Speed.you(이하 '회사'라고 함)는 회사가 제공하고자 하는 서비스(이하 ‘회사 서비스’)를 이용하는 개인(이하 ‘이용자’ 또는 ‘개인’)의 정보(이하 ‘개인정보’)를 보호하기 위해, 개인정보보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 '정보통신망법') 등 관련 법령을 준수하고, 서비스 이용자의 개인정보 보호 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보처리방침(이하 ‘본 방침’)을 수립합니다.<br />
            <br /><b>제2조(개인정보 처리의 원칙)</b><br />
            개인정보 관련 법령 및 본 방침에 따라 회사는 이용자의 개인정보를 수집할 수 있으며 수집된 개인정보는 개인의 동의가 있는 경우에 한해 제3자에게 제공될 수 있습니다. 단, 법령의 규정 등에 의해 적법하게 강제되는 경우 회사는 수집한 이용자의 개인정보를 사전에 개인의 동의 없이 제3자에게 제공할 수도 있습니다.<br />
            <br /><b>제3조(본 방침의 공개)</b><br />
            1. 회사는 이용자가 언제든지 쉽게 본 방침을 확인할 수 있도록 회사 홈페이지 첫 화면 또는 첫 화면과의 연결화면을 통해 본 방침을 공개하고 있습니다.<br />
            2. 회사는 제1항에 따라 본 방침을 공개하는 경우 글자 크기, 색상 등을 활용하여 이용자가 본 방침을 쉽게 확인할 수 있도록 합니다.<br />
            <br /><b>제4조(본 방침의 변경)</b><br />
            1. 본 방침은 개인정보 관련 법령, 지침, 고시 또는 정부나 회사 서비스의 정책이나 내용의 변경에 따라 개정될 수 있습니다.<br />
            2. 회사는 제1항에 따라 본 방침을 개정하는 경우 다음 각 호 하나 이상의 방법으로 공지합니다.<br />
            &emsp;1. 회사가 운영하는 인터넷 홈페이지의 첫 화면의 공지사항란 또는 별도의 창을 통하여 공지하는 방법<br />
            &emsp;2. 서면·모사전송·전자우편 또는 이와 비슷한 방법으로 이용자에게 공지하는 방법<br />
            3. 회사는 제2항의 공지는 본 방침 개정의 시행일로부터 최소 7일 이전에 공지합니다. 다만, 이용자 권리의 중요한 변경이 있을 경우에는 최소 30일 전에 공지합니다.<br />
            <br /><b>제5조(회원 가입을 위한 정보)</b><br />
            회사는 이용자의 회사 서비스에 대한 회원가입을 위하여 다음과 같은 정보를 수집합니다.<br />
            1. 필수 수집 정보: 이메일, 비밀번호, 닉네임<br />
            <br /><b>제6조(본인 인증을 위한 정보)</b><br />
            회사는 이용자의 본인인증을 위하여 다음과 같은 정보를 수집합니다.<br />
            1. 필수 수집 정보: 이메일 주소<br />
            <br /><b>제7조(회사 서비스 제공을 위한 정보)</b><br />
            회사는 이용자에게 회사의 서비스를 제공하기 위하여 다음과 같은 정보를 수집합니다.<br />
            1. 필수 수집 정보: 이메일 주소<br />
            2. 선택 수집 정보: (모바일 상품 지급 시) 전화번호<br />
            <br /><b>제8조(서비스 이용 및 부정 이용 확인을 위한 정보)</b><br />
            회사는 이용자의 서비스 이용에 따른 통계∙분석 및 부정이용의 확인∙분석을 위하여 다음과 같은 정보를 수집합니다. (부정이용이란 회원탈퇴 후 재가입, 상품구매 후 구매취소 등을 반복적으로 행하는 등 회사가 제공하는 할인쿠폰, 이벤트 혜택 등의 경제상 이익을 불·편법적으로 수취하는 행위, 이용약관 등에서 금지하고 있는 행위, 명의도용 등의 불·편법행위 등을 말합니다.)<br />
            1. 필수 수집 정보: 서비스 이용기록, 쿠키 및 기기정보<br />
            <br /><b>제9조(기타 수집 정보)</b><br />
            회사는 아래와 같이 정보를 수집합니다.<br />
            1. 수집목적: 통계학적 특성에 따른 서비스 제공 및 광고 게재, 서비스 유효성 확인, 광고성 정보 제공, 회원의 서비스 이용에 대한 통계<br />
            2. 수집정보: 서비스 이용기록<br />
            <br /><b>제10조(개인정보 수집 방법)</b><br />
            회사는 다음과 같은 방법으로 이용자의 개인정보를 수집합니다.<br />
            1. 이용자가 회사의 홈페이지에 자신의 개인정보를 입력하는 방식<br />
            2. 어플리케이션 등 회사가 제공하는 홈페이지 외의 서비스를 통해 이용자가 자신의 개인정보를 입력하는 방식<br />
            3. 이용자가 고객센터의 상담, 게시판에서의 활동 등 회사의 서비스를 이용하는 과정에서 이용자가 입력하는 방식<br />
            4. 설문지 응답<br />
            <br /><b>제11조(개인정보의 이용)</b><br />
            회사는 개인정보를 다음 각 호의 경우에 이용합니다.<br />
            1. 공지사항의 전달 등 회사운영에 필요한 경우<br />
            2. 이용문의에 대한 회신, 불만의 처리 등 이용자에 대한 서비스 개선을 위한 경우<br />
            3. 회사의 서비스를 제공하기 위한 경우<br />
            4. 법령 및 회사 약관을 위반하는 회원에 대한 이용 제한 조치, 부정 이용 행위를 포함하여 서비스의 원활한 운영에 지장을 주는 행위에 대한 방지 및 제재를 위한 경우<br />
            5. 신규 서비스 개발을 위한 경우<br />
            6. 이벤트 및 행사 안내 등 마케팅을 위한 경우<br />
            7. 인구통계학적 분석, 서비스 방문 및 이용기록의 분석을 위한 경우<br />
            8. 개인정보 및 관심에 기반한 이용자간 관계의 형성을 위한 경우<br />
            <br /><b>제12조(개인정보의 보유 및 이용기간)</b><br />
            1. 회사는 이용자의 개인정보에 대해 개인정보의 수집·이용 목적 달성을 위한 기간 동안 개인정보를 보유 및 이용합니다.<br />
            2. 전항에도 불구하고 회사는 내부 방침에 의해 서비스 부정이용기록은 부정 가입 및 이용 방지를 위하여 회원 탈퇴 시점으로부터 최대 1년간 보관합니다.<br />
            <br /><b>제13조(법령에 따른 개인정보의 보유 및 이용기간)</b><br />
            회사는 관계법령에 따라 다음과 같이 개인정보를 보유 및 이용합니다.<br />
            1. 전자상거래 등에서의 소비자보호에 관한 법률에 따른 보유정보 및 보유기간<br />
            &emsp;1. 계약 또는 청약철회 등에 관한 기록 : 5년<br />
            &emsp;2. 대금결제 및 재화 등의 공급에 관한 기록 : 5년<br />
            &emsp;3. 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년<br />
            &emsp;4. 표시•광고에 관한 기록 : 6개월<br />
            2. 통신비밀보호법에 따른 보유정보 및 보유기간<br />
            &emsp;1. 웹사이트 로그 기록 자료 : 3개월<br />
            3. 전자금융거래법에 따른 보유정보 및 보유기간<br />
            &emsp;1. 전자금융거래에 관한 기록 : 5년<br />
            4. 위치정보의 보호 및 이용 등에 관한 법률<br />
            &emsp;1. 개인위치정보에 관한 기록 : 6개월<br />
            <br /><b>제14조(개인정보의 파기원칙)</b><br />
            회사는 원칙적으로 이용자의 개인정보 처리 목적의 달성, 보유·이용기간의 경과 등 개인정보가 필요하지 않을 경우에는 해당 정보를 지체 없이 파기합니다.<br />
            <br /><b>제15조(개인정보파기절차)</b><br />
            1. 이용자가 회원가입 등을 위해 입력한 정보는 개인정보 처리 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기 되어집니다.<br />
            2. 회사는 파기 사유가 발생한 개인정보를 개인정보보호 책임자의 승인절차를 거쳐 파기합니다.<br />
            <br /><b>제16조(개인정보파기방법)</b><br />
            회사는 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하며, 종이로 출력된 개인정보는 분쇄기로 분쇄하거나 소각 등을 통하여 파기합니다.<br />
            <br /><b>제17조(광고성 정보의 전송 조치)</b><br />
            1. 회사는 전자적 전송매체를 이용하여 영리목적의 광고성 정보를 전송하는 경우 이용자의 명시적인 사전동의를 받습니다. 다만, 다음 각호 어느 하나에 해당하는 경우에는 사전 동의를 받지 않습니다.<br />
            &emsp;1. 회사가 재화 등의 거래관계를 통하여 수신자로부터 직접 연락처를 수집한 경우, 거래가 종료된 날로부터 6개월 이내에 회사가 처리하고 수신자와 거래한 것과 동종의 재화 등에 대한 영리목적의 광고성 정보를 전송하려는 경우<br />
            &emsp;2. 「방문판매 등에 관한 법률」에 따른 전화권유판매자가 육성으로 수신자에게 개인정보의 수집출처를 고지하고 전화권유를 하는 경우<br />
            2. 회사는 전항에도 불구하고 수신자가 수신거부의사를 표시하거나 사전 동의를 철회한 경우에는 영리목적의 광고성 정보를 전송하지 않으며 수신거부 및 수신동의 철회에 대한 처리 결과를 알립니다.<br />
            3. 회사는 오후 9시부터 그다음 날 오전 8시까지의 시간에 전자적 전송매체를 이용하여 영리목적의 광고성 정보를 전송하는 경우에는 제1항에도 불구하고 그 수신자로부터 별도의 사전 동의를 받습니다.<br />
            4. 회사는 전자적 전송매체를 이용하여 영리목적의 광고성 정보를 전송하는 경우 다음의 사항 등을 광고성 정보에 구체적으로 밝힙니다.<br />
            &emsp;1. 회사명 및 연락처<br />
            &emsp;2. 수신 거부 또는 수신 동의의 철회 의사표시에 관한 사항의 표시<br />
            5. 회사는 전자적 전송매체를 이용하여 영리목적의 광고성 정보를 전송하는 경우 다음 각 호의 어느 하나에 해당하는 조치를 하지 않습니다.<br />
            &emsp;1. 광고성 정보 수신자의 수신거부 또는 수신동의의 철회를 회피·방해하는 조치<br />
            &emsp;2. 숫자·부호 또는 문자를 조합하여 전화번호·전자우편주소 등 수신자의 연락처를 자동으로 만들어 내는 조치<br />
            &emsp;3. 영리목적의 광고성 정보를 전송할 목적으로 전화번호 또는 전자우편주소를 자동으로 등록하는 조치<br />
            &emsp;4. 광고성 정보 전송자의 신원이나 광고 전송 출처를 감추기 위한 각종 조치<br />
            &emsp;5. 영리목적의 광고성 정보를 전송할 목적으로 수신자를 기망하여 회신을 유도하는 각종 조치<br />
            <br /><b>제18조(아동의 개인정보보호)</b><br />
            1. 회사는 만 14세 미만 아동의 개인정보 보호를 위하여 만 14세 이상의 이용자에 한하여 회원가입을 허용합니다.<br />
            2. 제1항에도 불구하고 회사는 이용자가 만 14세 미만의 아동일 경우에는, 그 아동의 법정대리인으로부터 그 아동의 개인정보 수집, 이용, 제공 등의 동의를 그 아동의 법정대리인으로부터 받습니다.<br />
            3. 제2항의 경우 회사는 그 법정대리인의 이름, 생년월일, 성별, 중복가입확인정보(ID), 휴대폰 번호 등을 추가로 수집합니다.<br />
            <br /><b>제19조(개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)</b><br />
            1. 회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용 정보를 저장하고 수시로 불러오는 개인정보 자동 수집장치(이하 '쿠키')를 사용합니다. 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 웹브라우저(PC 및 모바일을 포함)에게 보내는 소량의 정보이며 이용자의 저장공간에 저장되기도 합니다.<br />
            2. 이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 이용자는 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.<br />
            3. 다만, 쿠키의 저장을 거부할 경우에는 로그인이 필요한 회사의 일부 서비스는 이용에 어려움이 있을 수 있습니다.<br />
            <br /><b>제20조(쿠키 설치 허용 지정 방법)</b><br />
            웹브라우저 옵션 설정을 통해 쿠키 허용, 쿠키 차단 등의 설정을 할 수 있습니다.<br />
            1. Edge : 웹브라우저 우측 상단의 설정 메뉴 &gt; 쿠키 및 사이트 권한 &gt; 쿠키 및 사이트 데이터 관리 및 삭제<br />
            2. Chrome : 웹브라우저 우측 상단의 설정 메뉴 &gt; 개인정보 및 보안 &gt; 쿠키 및 기타 사이트 데이터<br />
            3. Whale : 웹브라우저 우측 상단의 설정 메뉴 &gt; 개인정보 보호 &gt; 쿠키 및 기타 사이트 데이터<br />
            <br /><b>제21조(회사의 개인정보 보호 책임자 지정)</b><br />
            1. 회사는 이용자의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 관련 부서 및 개인정보 보호 책임자를 지정하고 있습니다.<br />
            &emsp;a. 개인정보 보호 책임자<br />
            &emsp;&emsp;i. 성명: 윤재훈<br />
            &emsp;&emsp;ii. 이메일: speed.you.email@gmail.com<br />
        </p>
    }

    return (
        <div id={style["container"]}>
            <div id={style["title"]} className={theme === "LIGHT" ? colorStyle["black-font"] : colorStyle["white-font"]}>
                {about === "SERVICE" ? "이용약관" : "개인정보처리방침"}
            </div>
            {content}
        </div>
    );
}

export default TermPage;
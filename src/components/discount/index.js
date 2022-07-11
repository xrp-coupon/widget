import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalOverlay,
	ModalHeader,
} from '@chakra-ui/react';

const DiscountCouponModel = (props) => {
	const { isOpen, onClose } = props;
	return (
		<>
      <Modal
				isCentered
				scrollBehavior={"inside"}
				closeOnOverlayClick
				blockScrollOnMount={false}
				preserveScrollBarGap
				lockFocusAcrossFrames={false}
				isOpen={isOpen}
				onClose={onClose}
				size="3xl"
			>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader margin="0" padding="0" textAlign="center" mt="12px">Here is your discount code!</ModalHeader>
          <ModalCloseButton size="lg" border="1px solid black" />
          <ModalBody>
						<p>Thank you for paying with XRP. Your TX is confimed and hash saved.</p>
						<p>Please find your one-time discount code below.</p>
						<h1>{xrpPayments.post.success.data.discount.code}</h1>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
	)
}

export default DiscountCouponModel;
